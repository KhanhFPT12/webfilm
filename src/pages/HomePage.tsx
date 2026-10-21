import { ArrowRight, Ghost, Heart, History, Laugh, Rabbit, Rocket, Swords, Play } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyState } from "../components/common/EmptyState";
import { PosterImage } from "../components/common/PosterImage";
import { Reveal } from "../components/common/Reveal";
import { SectionHeader } from "../components/common/SectionHeader";
import { PlatformFeatures } from "../components/common/PlatformFeatures";
import { HeroBanner } from "../components/movie/HeroBanner";
import { MovieCard } from "../components/movie/MovieCard";
import { MovieSection } from "../components/movie/MovieSection";
import { TopTrendingSection } from "../components/movie/TopTrendingSection";
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
    <Reveal as="section" labelledBy="genres-title">
      <SectionHeader
        id="genres-title"
        title="Khám phá theo thể loại"
        subtitle="Chọn thể loại phim theo tâm trạng tối nay"
        to="/the-loai"
        linkLabel="Xem tất cả thể loại"
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {genres.map((g) => {
          const Icon = GENRE_ICONS[g.slug] ?? Heart;
          return (
            <Link
              key={g.slug}
              to={`/the-loai/${g.slug}`}
              className="group flex items-center gap-3 rounded-2xl border border-line bg-surface p-3.5 transition-all duration-200 hover:-translate-y-1 hover:border-deep/50 hover:shadow-glow-sm"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sub text-deep transition-all group-hover:bg-deep group-hover:text-white group-hover:shadow-glow-sm">
                <Icon className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-bold text-ink transition-colors group-hover:text-deep sm:text-sm">
                  {g.name}
                </span>
                {g.note && <span className="block truncate text-[11px] text-muted">{g.note}</span>}
              </span>
            </Link>
          );
        })}
      </div>
    </Reveal>
  );
}

function ContinueWatching() {
  const { history } = useWatchHistory();
  const items = history.slice(0, 4);
  if (!items.length) return null;
  return (
    <Reveal as="section" labelledBy="continue-title">
      <SectionHeader id="continue-title" title="Xem tiếp gần đây" to="/lich-su" linkLabel="Lịch sử xem" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((h) => (
          <Link
            key={h.slug}
            to={h.episodeSlug ? watchUrl(h.slug, h.episodeSlug, h.serverIndex ?? 0) : `/xem-phim/${h.slug}`}
            className="group flex items-center gap-3 rounded-2xl border border-line bg-surface p-2.5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-deep/40 hover:shadow-glow-sm"
          >
            <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-xl border border-line bg-sub">
              <PosterImage src={h.poster} fallback={h.posterFallback} alt="" className="size-full object-cover" />
              {/* Progress bar simulation */}
              <div className="absolute inset-x-0 bottom-0 h-1.5 bg-black/60 backdrop-blur-xs">
                <div className="h-full w-3/4 rounded-full bg-deep shadow-glow-sm" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-ink group-hover:text-deep sm:text-sm">{h.name}</p>
              {h.episodeName && <p className="mt-0.5 text-xs font-semibold text-deep">{episodeLabel(h.episodeName)}</p>}
              <p className="mt-1 text-[11px] text-muted">{timeAgo(h.watchedAt)}</p>
            </div>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sub text-deep transition-all group-hover:scale-105 group-hover:bg-deep group-hover:text-white group-hover:shadow-glow-sm">
              <Play className="ml-0.5 size-4 fill-current" />
            </span>
          </Link>
        ))}
      </div>
    </Reveal>
  );
}

function FavoritesCorner() {
  const { favorites } = useFavorites();
  return (
    <Reveal as="section" labelledBy="fav-title" className="rounded-2xl border border-line bg-sub/40 p-5 sm:p-7">
      <SectionHeader
        id="fav-title"
        title="Góc phim của Sony"
        subtitle={favorites.length ? `${favorites.length} bộ phim đang được lưu giữ` : undefined}
        to={favorites.length ? "/yeu-thich" : undefined}
      />
      {favorites.length === 0 ? (
        <EmptyState
          title="Góc phim yêu thích còn trống"
          description={
            <>
              Bấm vào biểu tượng trái tim trên poster phim bất kỳ để lưu lại vào đây. Danh sách được lưu an toàn trên trình duyệt này.
            </>
          }
          action={
            <Link to="/phim-moi" className="btn-primary shadow-glow-sm">
              Khám phá phim ngay <ArrowRight className="size-4" />
            </Link>
          }
        />
      ) : (
        <div className="-mx-1 flex snap-x gap-3.5 overflow-x-auto px-1 pb-2 scrollbar-none sm:grid sm:grid-cols-3 sm:gap-4.5 sm:overflow-visible md:grid-cols-4 lg:grid-cols-5">
          {favorites.slice(0, 5).map((f) => (
            <div
              key={f.slug}
              className="w-[40%] min-w-[140px] shrink-0 snap-start sm:w-auto sm:min-w-0 md:[&:nth-child(5)]:hidden lg:[&:nth-child(5)]:block"
            >
              <MovieCard movie={favoriteToMovie(f)} />
            </div>
          ))}
        </div>
      )}
    </Reveal>
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

      <div className="container-page space-y-12 py-8 sm:py-12">
        <ContinueWatching />

        {/* Top 10 Trending Section */}
        <TopTrendingSection movies={latest.data?.items} loading={latest.loading} />

        <MovieSection
          id="latest-title"
          title="Phim mới cập bến"
          subtitle="Những tác phẩm vừa được cập nhật trên hệ thống"
          to="/phim-moi"
          movies={latest.data?.items}
          loading={latest.loading}
          error={latest.error}
          onRetry={latest.reload}
        />

        <GenreExplorer />

        <MovieSection
          id="single-title"
          title="Phim lẻ chọn lọc"
          subtitle="Trọn vẹn một câu chuyện cho buổi tối thảnh thơi"
          to="/phim-le"
          movies={single.data?.items}
          loading={single.loading}
          error={single.error}
          onRetry={single.reload}
        />

        <MovieSection
          id="series-title"
          title="Phim bộ dài tập"
          subtitle="Theo dõi những series hấp dẫn nhiều tập"
          to="/phim-bo"
          movies={series.data?.items}
          loading={series.loading}
          error={series.error}
          onRetry={series.reload}
        />

        {/* Platform Experience Value Props */}
        <PlatformFeatures />

        <FavoritesCorner />

        <p className="flex items-center justify-center gap-1.5 text-xs text-muted/80">
          <History className="size-3.5 text-deep" /> Lịch sử xem và danh sách yêu thích được lưu an toàn trên trình duyệt của bạn.
        </p>
      </div>
    </>
  );
}
