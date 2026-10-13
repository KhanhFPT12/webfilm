import { ArrowLeft, ChevronLeft, ChevronRight, Info, ListVideo } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ErrorState } from "../components/common/ErrorState";
import { EpisodeList, watchUrl } from "../components/movie/EpisodeList";
import { FavoriteButton } from "../components/movie/FavoriteButton";
import { RelatedMovies } from "../components/movie/RelatedMovies";
import { VideoPlayer } from "../components/movie/VideoPlayer";
import { useMovieDetail } from "../hooks/useMovies";
import { useDocumentTitle } from "../hooks/useUtils";
import { useWatchHistory } from "../hooks/useWatchHistory";
import { episodeLabel, isSeries, truncate } from "../utils/formatters";

function WatchSkeleton() {
  return (
    <div className="container-page py-6" role="status">
      <span className="sr-only">Đang tải trình phát…</span>
      <div className="skeleton mb-4 h-6 w-1/2 rounded" />
      <div className="skeleton aspect-video w-full rounded-xl" />
      <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(76px,1fr))] gap-2">
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className="skeleton h-10 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export function WatchPage() {
  const { slug } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { data: movie, loading, error, reload } = useMovieDetail(slug);
  const { get, record } = useWatchHistory();

  const tap = params.get("tap");
  const svParam = Number.parseInt(params.get("sv") ?? "0", 10) || 0;

  // Xác định server + tập từ URL; nếu thiếu thì tiếp tục từ lịch sử hoặc tập đầu.
  const selection = useMemo(() => {
    if (!movie || movie.servers.length === 0) return null;
    const resume = slug ? get(slug) : undefined;
    let serverIndex = svParam >= 0 && svParam < movie.servers.length ? svParam : 0;
    const wanted = tap ?? (resume?.episodeSlug && !params.has("tap") ? resume.episodeSlug : undefined);
    if (!tap && resume?.serverIndex !== undefined && resume.serverIndex < movie.servers.length) serverIndex = resume.serverIndex;

    let episodes = movie.servers[serverIndex].episodes;
    let index = wanted ? episodes.findIndex((e) => e.slug === wanted) : 0;
    if (index < 0) {
      // Tập không có ở server này -> tìm ở server khác.
      const other = movie.servers.findIndex((s) => s.episodes.some((e) => e.slug === wanted));
      if (other >= 0) {
        serverIndex = other;
        episodes = movie.servers[other].episodes;
        index = episodes.findIndex((e) => e.slug === wanted);
      } else index = 0;
    }
    return { serverIndex, episodes, index, episode: episodes[index], missing: !!tap && episodes[index]?.slug !== tap };
    // `get` thay đổi mỗi khi lịch sử được ghi; chỉ cần đọc 1 lần khi đổi phim/URL.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movie, tap, svParam, slug]);

  // Chuẩn hoá URL để có thể chia sẻ đúng tập đang xem.
  useEffect(() => {
    if (!movie || !selection?.episode) return;
    if (tap !== selection.episode.slug || svParam !== selection.serverIndex) {
      navigate(watchUrl(movie.slug, selection.episode.slug, selection.serverIndex), { replace: true });
    }
  }, [movie, selection, tap, svParam, navigate]);

  // Lưu lịch sử xem (tập + server). Tiến độ thời gian không đọc được từ iframe khác domain.
  useEffect(() => {
    if (!movie || !selection?.episode) return;
    record({
      slug: movie.slug,
      name: movie.name,
      originalName: movie.originalName,
      poster: movie.poster,
      posterFallback: movie.posterFallback,
      episodeSlug: selection.episode.slug,
      episodeName: selection.episode.name,
      serverIndex: selection.serverIndex,
      totalEpisodes: selection.episodes.length,
    });
  }, [movie, selection, record]);

  const episodeTitle = selection?.episode ? episodeLabel(selection.episode.name) : "";
  useDocumentTitle(movie ? `Xem ${movie.name}${episodeTitle && episodeTitle !== "Full" ? ` – ${episodeTitle}` : ""}` : "Xem phim");

  const go = (serverIndex: number, episodeSlug: string) => navigate(watchUrl(movie!.slug, episodeSlug, serverIndex));

  return (
    <div className="theater bg-plum-950 text-pastel">
      {loading && !movie ? (
        <WatchSkeleton />
      ) : error || !movie ? (
        <div className="container-page py-12">
          <ErrorState tone="dark" error={error ?? new Error("Không tải được phim.")} onRetry={reload} />
        </div>
      ) : (
        <>
          <div className="container-page py-5 sm:py-7">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <Link
                  to={`/phim/${movie.slug}`}
                  className="inline-flex items-center gap-1.5 rounded text-sm font-medium text-plum-300 hover:text-white"
                >
                  <ArrowLeft className="size-4" /> Chi tiết phim
                </Link>
                <h1 className="mt-1.5 text-xl leading-snug font-bold text-white sm:text-2xl">
                  {movie.name}
                  {episodeTitle && isSeries(movie) && <span className="text-rose"> · {episodeTitle}</span>}
                </h1>
                {movie.originalName && <p className="truncate text-sm text-plum-300">{movie.originalName}</p>}
              </div>
              <FavoriteButton movie={movie} className="shrink-0" />
            </div>

            {selection?.missing && (
              <p className="mb-3 rounded-lg border border-plum-700 bg-plum-900 px-3 py-2 text-sm text-amber-200">
                Không tìm thấy tập bạn yêu cầu, đang phát {episodeTitle || "tập đầu tiên"}.
              </p>
            )}

            {selection ? (
              <VideoPlayer
                key={`${selection.serverIndex}-${selection.episode.slug}`}
                url={selection.episode.embed}
                title={`${movie.name} ${episodeTitle}`}
              />
            ) : (
              <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-xl bg-plum-900 px-6 text-center ring-1 ring-plum-700">
                <Info className="size-8 text-rose" />
                <p className="font-semibold text-white">Phim chưa có nguồn phát</p>
                <p className="max-w-md text-sm text-plum-300">API chưa cung cấp tập nào cho phim này. Bạn quay lại sau nhé.</p>
              </div>
            )}

            {selection && selection.episodes.length > 1 && (
              <div className="mt-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  className="btn border border-plum-700 text-pastel hover:border-rose hover:bg-plum-800 hover:text-white disabled:hover:border-plum-700 disabled:hover:bg-transparent"
                  disabled={selection.index <= 0}
                  onClick={() => go(selection.serverIndex, selection.episodes[selection.index - 1].slug)}
                >
                  <ChevronLeft className="size-4" /> Tập trước
                </button>
                <span className="text-sm text-plum-300">
                  {selection.index + 1} / {selection.episodes.length}
                </span>
                <button
                  type="button"
                  className="btn bg-deep text-white hover:bg-deeper disabled:hover:bg-deep"
                  disabled={selection.index >= selection.episodes.length - 1}
                  onClick={() => go(selection.serverIndex, selection.episodes[selection.index + 1].slug)}
                >
                  Tập tiếp <ChevronRight className="size-4" />
                </button>
              </div>
            )}
          </div>

          {selection && (
            <div className="border-t border-plum-800 bg-plum-900/60">
              <div className="container-page grid gap-8 py-7 lg:grid-cols-[1.3fr_1fr]">
                <section aria-labelledby="watch-eps">
                  <h2 id="watch-eps" className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
                    <ListVideo className="size-5 text-rose" /> Chọn tập
                  </h2>
                  <EpisodeList
                    tone="dark"
                    slug={movie.slug}
                    servers={movie.servers}
                    serverIndex={selection.serverIndex}
                    onServerChange={(i) =>
                      go(
                        i,
                        movie.servers[i].episodes.find((e) => e.slug === selection.episode.slug)?.slug ?? movie.servers[i].episodes[0].slug,
                      )
                    }
                    activeEpisode={selection.episode.slug}
                  />
                </section>
                <section aria-labelledby="watch-about" className="rounded-xl border border-plum-800 bg-plum-950/60 p-5">
                  <h2 id="watch-about" className="font-bold text-white">
                    Về bộ phim
                  </h2>
                  <p className="mt-2 text-sm text-plum-300">
                    {[movie.year, movie.quality, movie.language, movie.time].filter(Boolean).join(" · ")}
                  </p>
                  {movie.description && <p className="mt-3 text-sm leading-relaxed text-pastel/85">{truncate(movie.description, 320)}</p>}
                  <Link
                    to={`/phim/${movie.slug}`}
                    className="mt-4 inline-flex items-center gap-1 rounded text-sm font-semibold text-rose hover:text-white"
                  >
                    Xem thông tin đầy đủ <ChevronRight className="size-4" />
                  </Link>
                </section>
              </div>
            </div>
          )}
        </>
      )}
      {movie && (
        <div className="bg-blush text-ink">
          <div className="container-page py-10">
            <RelatedMovies movie={movie} />
          </div>
        </div>
      )}
    </div>
  );
}
