import { CalendarDays, Clapperboard, Clock, Globe2, Info, ListVideo, Play, Share2, Tags, Users } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { ErrorState } from "../components/common/ErrorState";
import { DetailSkeleton } from "../components/common/LoadingSkeleton";
import { PosterImage } from "../components/common/PosterImage";
import { useToast } from "../components/common/Toast";
import { EpisodeList, watchUrl } from "../components/movie/EpisodeList";
import { FavoriteButton } from "../components/movie/FavoriteButton";
import { RelatedMovies } from "../components/movie/RelatedMovies";
import { useMovieDetail } from "../hooks/useMovies";
import { useDocumentTitle } from "../hooks/useUtils";
import { useWatchHistory } from "../hooks/useWatchHistory";
import type { MovieDetail, TaxonomyItem } from "../types/movie";
import { episodeLabel, isSeries, splitPeople } from "../utils/formatters";

function InfoRow({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[20px_90px_1fr] items-start gap-x-3 py-2.5 text-xs sm:grid-cols-[20px_110px_1fr] sm:text-sm">
      <span className="mt-0.5 text-deep">{icon}</span>
      <dt className="font-medium text-muted">{label}</dt>
      <dd className="min-w-0 text-ink">{children}</dd>
    </div>
  );
}

function TaxonomyLinks({ items, base }: { items: TaxonomyItem[]; base: string }) {
  return (
    <span className="flex flex-wrap gap-1.5">
      {items.map((t) =>
        t.slug ? (
          <Link
            key={t.name}
            to={`${base}/${t.slug}`}
            className="rounded border border-line bg-surface px-2 py-0.5 text-xs font-medium text-ink transition-colors hover:border-deep/40 hover:text-deep"
          >
            {t.name}
          </Link>
        ) : (
          <span key={t.name} className="rounded border border-line bg-sub px-2 py-0.5 text-xs text-muted">
            {t.name}
          </span>
        ),
      )}
    </span>
  );
}

function ShareButton({ movie }: { movie: MovieDetail }) {
  const toast = useToast();
  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: movie.name, text: `Cùng xem “${movie.name}” trên rạp phim của Sony nhé`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.show("Đã sao chép liên kết phim vào bộ nhớ tạm");
    } catch (e) {
      if ((e as Error)?.name !== "AbortError") toast.show("Bạn hãy sao chép link trên thanh địa chỉ trình duyệt nhé");
    }
  };
  return (
    <button type="button" className="btn-secondary h-11 px-4 text-sm" onClick={share}>
      <Share2 className="size-4" /> Chia sẻ
    </button>
  );
}

export function MovieDetailPage() {
  const { slug } = useParams();
  const { data: movie, loading, error, reload } = useMovieDetail(slug);
  const { get } = useWatchHistory();
  const [serverIndex, setServerIndex] = useState(0);
  useEffect(() => setServerIndex(0), [slug]);
  useDocumentTitle(movie?.name ?? (loading ? "Đang tải…" : "Chi tiết phim"));

  if (loading && !movie) return <DetailSkeleton />;
  if (error || !movie) {
    return (
      <div className="container-page py-12">
        <ErrorState error={error ?? new Error("Không tải được thông tin phim.")} onRetry={reload} />
      </div>
    );
  }

  const series = isSeries(movie);
  const firstEpisode = movie.servers[0]?.episodes[0];
  const history = get(movie.slug);
  const resume = history?.episodeSlug ? history : undefined;
  const directors = splitPeople(movie.director);
  const casts = splitPeople(movie.casts);
  const episodeCount = movie.servers[0]?.episodes.length ?? 0;
  const status =
    movie.currentEpisode && movie.totalEpisodes
      ? `${movie.currentEpisode}${series ? ` · ${movie.totalEpisodes} tập` : ""}`
      : movie.currentEpisode;

  const badges = [movie.quality, movie.language, movie.year].filter(Boolean) as string[];

  return (
    <>
      {/* Hero chi tiết phim — Tinh tế, không chấm bi, không gradient thô */}
      <section className="relative overflow-hidden border-b border-line bg-sub/50">
        {movie.backdrop && (
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 opacity-15 lg:block" aria-hidden="true">
            <PosterImage src={movie.backdrop} fallback={movie.backdropFallback} alt="" eager className="size-full" />
            <div className="absolute inset-0 bg-gradient-to-r from-sub/90 via-sub/50 to-transparent" />
          </div>
        )}

        <div className="container-page relative grid gap-7 py-8 sm:py-10 md:grid-cols-[220px_1fr] md:gap-10 lg:grid-cols-[260px_1fr]">
          {/* Cột poster */}
          <div className="mx-auto w-44 sm:w-52 md:w-full">
            <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-line bg-surface shadow-sm">
              <PosterImage
                src={movie.poster}
                fallback={movie.posterFallback}
                alt={`Poster ${movie.name}`}
                eager
                className="size-full"
              />
            </div>
          </div>

          {/* Cột thông tin */}
          <div className="min-w-0">
            <nav aria-label="Breadcrumb" className="mb-2 text-xs text-muted">
              <Link to="/" className="transition-colors hover:text-deep">
                Trang chủ
              </Link>
              <span className="mx-1.5 text-line" aria-hidden="true">
                /
              </span>
              <Link to={series ? "/phim-bo" : "/phim-le"} className="transition-colors hover:text-deep">
                {series ? "Phim bộ" : "Phim lẻ"}
              </Link>
            </nav>

            <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl lg:text-[34px] lg:leading-snug">
              {movie.name}
            </h1>
            {movie.originalName && (
              <p className="mt-1 text-sm text-muted sm:text-base">{movie.originalName}</p>
            )}

            {badges.length > 0 && (
              <div className="mt-3.5 flex flex-wrap gap-1.5">
                {badges.map((b) => (
                  <span key={b} className="badge border border-line bg-surface text-ink text-xs">
                    {b}
                  </span>
                ))}
                {movie.currentEpisode && (
                  <span className="badge bg-deep text-white text-xs">
                    {movie.currentEpisode}
                  </span>
                )}
              </div>
            )}

            {/* Các nút hành động */}
            <div className="mt-6 flex flex-wrap gap-2.5">
              {firstEpisode ? (
                <Link
                  to={
                    resume ? watchUrl(movie.slug, resume.episodeSlug!, resume.serverIndex ?? 0) : watchUrl(movie.slug, firstEpisode.slug, 0)
                  }
                  className="btn-primary h-11 px-5 text-sm"
                >
                  <Play className="size-4 fill-white" />
                  <span>{resume && series ? `Xem tiếp ${episodeLabel(resume.episodeName ?? "")}` : "Xem phim ngay"}</span>
                </Link>
              ) : (
                <button type="button" disabled className="btn-primary h-11 px-5 text-sm" title="Phim chưa có nguồn phát">
                  <Play className="size-4" /> Chưa có tập để xem
                </button>
              )}
              <FavoriteButton movie={movie} variant="button" className="h-11 px-4 text-sm" />
              <ShareButton movie={movie} />
            </div>

            {/* Bảng metadata phim */}
            <dl className="mt-6 divide-y divide-line/60 rounded-xl border border-line bg-surface/80 px-4 py-1 shadow-xs">
              {movie.genres.length > 0 && (
                <InfoRow icon={<Tags className="size-4" />} label="Thể loại">
                  <TaxonomyLinks items={movie.genres} base="/the-loai" />
                </InfoRow>
              )}
              {movie.countries.length > 0 && (
                <InfoRow icon={<Globe2 className="size-4" />} label="Quốc gia">
                  <TaxonomyLinks items={movie.countries} base="/quoc-gia" />
                </InfoRow>
              )}
              {movie.year && (
                <InfoRow icon={<CalendarDays className="size-4" />} label="Năm phát hành">
                  <Link to={`/nam/${movie.year}`} className="font-medium text-deep hover:underline">
                    {movie.year}
                  </Link>
                </InfoRow>
              )}
              {movie.time && (
                <InfoRow icon={<Clock className="size-4" />} label="Thời lượng">
                  {movie.time}
                </InfoRow>
              )}
              {status && (
                <InfoRow icon={<ListVideo className="size-4" />} label={series ? "Tình trạng" : "Phiên bản"}>
                  {status}
                </InfoRow>
              )}
              {directors.length > 0 && (
                <InfoRow icon={<Clapperboard className="size-4" />} label="Đạo diễn">
                  {directors.join(", ")}
                </InfoRow>
              )}
              {casts.length > 0 && (
                <InfoRow icon={<Users className="size-4" />} label="Diễn viên">
                  <span className="line-clamp-3">{casts.join(", ")}</span>
                </InfoRow>
              )}
            </dl>
          </div>
        </div>
      </section>

      {/* Nội dung chi tiết & Danh sách tập */}
      <div className="container-page space-y-12 py-10">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          <section aria-labelledby="desc-title">
            <h2 id="desc-title" className="section-title flex items-center gap-2.5">
              <span className="h-4.5 w-1 rounded-full bg-deep" aria-hidden="true" />
              <span>Nội dung phim</span>
            </h2>
            {movie.description ? (
              <p className="mt-4 text-sm leading-relaxed whitespace-pre-line text-ink/85 sm:text-[15px]">
                {movie.description}
              </p>
            ) : (
              <p className="mt-4 flex items-center gap-2 text-sm text-muted">
                <Info className="size-4" /> Phim chưa có tóm tắt nội dung.
              </p>
            )}
          </section>

          <section aria-labelledby="eps-title">
            <h2 id="eps-title" className="section-title flex items-center gap-2.5">
              <span className="h-4.5 w-1 rounded-full bg-deep" aria-hidden="true" />
              <span>{series ? "Danh sách tập" : "Nguồn phát"}</span>
              {episodeCount > 1 && <span className="text-sm font-normal text-muted">({episodeCount} tập)</span>}
            </h2>
            <div className="mt-4">
              {movie.servers.length ? (
                <EpisodeList
                  slug={movie.slug}
                  servers={movie.servers}
                  serverIndex={serverIndex}
                  onServerChange={setServerIndex}
                  activeEpisode={resume?.serverIndex === serverIndex ? resume?.episodeSlug : undefined}
                />
              ) : (
                <p className="rounded-xl border border-dashed border-line bg-surface px-4 py-8 text-center text-sm text-muted">
                  API chưa cung cấp nguồn phát cho phim này. Bạn quay lại sau nhé.
                </p>
              )}
            </div>
          </section>
        </div>

        <RelatedMovies movie={movie} />
      </div>
    </>
  );
}
