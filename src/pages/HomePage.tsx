import { ArrowRight, Ghost, Heart, History, Laugh, Rabbit, Rocket, Swords, Play } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyState } from "../components/common/EmptyState";
import { PosterImage } from "../components/common/PosterImage";
import { SectionHeader } from "../components/common/SectionHeader";
import { HeroBanner } from "../components/movie/HeroBanner";
import { MovieCard } from "../components/movie/MovieCard";
import { MovieSection } from "../components/movie/MovieSection";
import { watchUrl } from "../components/movie/EpisodeList";
import { favoriteToMovie, useFavorites } from "../hooks/useFavorites";
import { useLatestMovies, useListMovies } from "../hooks/useMovies";
import { useDocumentTitle } from "../hooks/useUtils";
import { useWatchHistory } from "../hooks/useWatchHistory";
import { FEATURED_GENRES, GENRES } from "../utils/catalog";
import { episodeLabel, timeAgo } from "../utils/formatters";

const GENRE_ICONS: Record<string, LucideIcon> = {
  "tinh-cam": Heart,
  "phim-hai": Laugh,
  "hanh-dong": Swords,
  "kinh-di": Ghost,
  "hoat-hinh": Rabbit,
  "khoa-hoc-vien-tuong": Rocket,
};

function GenreExplorer() {
  const genres = FEATURED_GENRES.map((slug) => GENRES.find((g) => g.slug === slug)!).filter(Boolean);
  return (
    <section aria-labelledby="genres-title">
      <SectionHeader
        id="genres-title"
        title="Khám phá theo thể loại"
        subtitle="Chọn một màu cảm xúc cho tối nay"
        to="/the-loai"
        linkLabel="Tất cả thể loại"
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {genres.map((g) => {
          const Icon = GENRE_ICONS[g.slug] ?? Heart;
          return (
            <Link
              key={g.slug}
              to={`/the-loai/${g.slug}`}
              className="group flex items-center gap-3 rounded-xl border border-line bg-pastel/70 px-4 py-3.5 transition-[background-color,border-color,transform] hover:-translate-y-0.5 hover:border-rose hover:bg-pastel"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white text-deep shadow-sm">
                <Icon className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="block font-semibold text-ink group-hover:text-deep">{g.name}</span>
                {g.note && <span className="block truncate text-xs text-muted">{g.note}</span>}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function ContinueWatching() {
  const { history } = useWatchHistory();
  const items = history.slice(0, 4);
  if (!items.length) return null;
  return (
    <section aria-labelledby="continue-title">
      <SectionHeader id="continue-title" title="Xem tiếp nhé" to="/lich-su" linkLabel="Lịch sử xem" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((h) => (
          <Link
            key={h.slug}
            to={h.episodeSlug ? watchUrl(h.slug, h.episodeSlug, h.serverIndex ?? 0) : `/xem-phim/${h.slug}`}
            className="group flex items-center gap-3 rounded-xl border border-line bg-white p-2.5 shadow-[var(--shadow-card)] transition-colors hover:border-rose"
          >
            <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-md">
              <PosterImage src={h.poster} fallback={h.posterFallback} alt="" className="size-full" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-ink group-hover:text-deep">{h.name}</p>
              {h.episodeName && <p className="text-sm text-deep">{episodeLabel(h.episodeName)}</p>}
              <p className="text-xs text-muted">{timeAgo(h.watchedAt)}</p>
            </div>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-pastel text-deep transition-colors group-hover:bg-deep group-hover:text-white">
              <Play className="size-4 fill-current" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function FavoritesCorner() {
  const { favorites } = useFavorites();
  return (
    <section aria-labelledby="fav-title" className="rounded-2xl border border-line bg-white p-5 sm:p-7">
      <SectionHeader
        id="fav-title"
        title={
          <>
            Góc phim của Sony <span aria-hidden="true">💗</span>
          </>
        }
        subtitle={favorites.length ? `${favorites.length} bộ phim đang được thương` : undefined}
        to={favorites.length ? "/yeu-thich" : undefined}
      />
      {favorites.length === 0 ? (
        <EmptyState
          title="Góc phim còn trống trải quá"
          description={
            <>
              Bấm vào biểu tượng <Heart className="inline size-4 fill-deep text-deep" aria-label="trái tim" /> trên poster bất kỳ để cất bộ
              phim bạn thích vào đây. Danh sách được lưu ngay trên trình duyệt này.
            </>
          }
          action={
            <Link to="/phim-moi" className="btn-primary">
              Đi tìm phim thương <ArrowRight className="size-4" />
            </Link>
          }
        />
      ) : (
        <div className="-mx-1 flex snap-x gap-3.5 overflow-x-auto px-1 pb-2 scrollbar-none sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible md:grid-cols-4 lg:grid-cols-5">
          {favorites.slice(0, 5).map((f) => (
            <div
              key={f.slug}
              className="w-[42%] min-w-[150px] shrink-0 snap-start sm:w-auto sm:min-w-0 md:[&:nth-child(5)]:hidden lg:[&:nth-child(5)]:block"
            >
              <MovieCard movie={favoriteToMovie(f)} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export function HomePage() {
  useDocumentTitle();
  const latest = useLatestMovies(1);
  const single = useListMovies("phim-le", 1);
  const series = useListMovies("phim-bo", 1);

  return (
    <>
      <HeroBanner movies={latest.data?.items} loading={latest.loading} error={latest.error} onRetry={latest.reload} />

      <div className="container-page space-y-14 py-10 sm:py-12">
        <ContinueWatching />

        <MovieSection
          id="latest-title"
          title="Mới cập bến rạp hồng"
          subtitle="Phim vừa được cập nhật trên hệ thống"
          to="/phim-moi"
          movies={latest.data?.items}
          loading={latest.loading}
          error={latest.error}
          onRetry={latest.reload}
        />

        <GenreExplorer />

        <MovieSection
          id="single-title"
          title="Phim lẻ cho buổi tối thư giãn"
          subtitle="Trọn vẹn một câu chuyện, không cần chờ tập mới"
          to="/phim-le"
          movies={single.data?.items}
          loading={single.loading}
          error={single.error}
          onRetry={single.reload}
        />

        <MovieSection
          id="series-title"
          title="Phim bộ để cày cuối tuần"
          subtitle="Những bộ phim dài tập vừa có tập mới"
          to="/phim-bo"
          movies={series.data?.items}
          loading={series.loading}
          error={series.error}
          onRetry={series.reload}
        />

        <FavoritesCorner />

        <p className="flex items-center justify-center gap-1.5 text-sm text-muted">
          <History className="size-4" /> Lịch sử xem và danh sách yêu thích chỉ được lưu trên trình duyệt của bạn.
        </p>
      </div>
    </>
  );
}
