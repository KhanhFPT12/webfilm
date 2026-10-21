import { ChevronLeft, ChevronRight, Eye, Flame, Play } from "lucide-react";
import { useRef, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { usePreview } from "../../context/PreviewContext";
import type { Movie } from "../../types/movie";
import { CardSkeleton } from "../common/LoadingSkeleton";
import { PosterImage } from "../common/PosterImage";
import { Reveal } from "../common/Reveal";
import { SectionHeader } from "../common/SectionHeader";
import { FavoriteButton } from "./FavoriteButton";

interface Props {
  movies?: Movie[];
  loading: boolean;
}

export function TopTrendingSection({ movies, loading }: Props) {
  const { openPreview } = usePreview();
  const scrollRef = useRef<HTMLDivElement>(null);
  const items = (movies ?? []).slice(0, 10);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -460 : 460;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  const handleQuickPreview = (e: MouseEvent, movie: Movie) => {
    e.preventDefault();
    e.stopPropagation();
    openPreview(movie);
  };

  if (!loading && items.length === 0) return null;

  return (
    <Reveal as="section" labelledBy="top-trending-title" className="relative">
      <div className="flex items-end justify-between">
        <SectionHeader
          id="top-trending-title"
          title={
            <span className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-orange-500/15 text-orange-500">
                <Flame className="size-4.5 fill-orange-500" />
              </span>
              <span>Top 10 Thịnh Hành Hôm Nay</span>
            </span>
          }
          subtitle="Những tác phẩm thu hút sự chú ý nhiều nhất tại rạp"
          to="/phim-moi"
          linkLabel="Xem bảng xếp hạng đầy đủ"
        />

        {/* Desktop Carousel Navigation Chevrons */}
        <div className="hidden items-center gap-1.5 pb-3 lg:flex">
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Cuộn sang trái"
            className="flex size-9 items-center justify-center rounded-full border border-line bg-surface text-ink transition-all hover:border-deep/50 hover:bg-sub hover:text-deep active:scale-95"
          >
            <ChevronLeft className="size-4.5" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Cuộn sang phải"
            className="flex size-9 items-center justify-center rounded-full border border-line bg-surface text-ink transition-all hover:border-deep/50 hover:bg-sub hover:text-deep active:scale-95"
          >
            <ChevronRight className="size-4.5" />
          </button>
        </div>
      </div>

      {loading && !items.length ? (
        <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-none sm:mx-0 sm:px-0">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-[180px] shrink-0 sm:w-[220px]">
              <CardSkeleton />
            </div>
          ))}
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 scrollbar-none sm:mx-0 sm:px-0"
        >
          {items.map((m, index) => {
            const rank = index + 1;
            return (
              <div
                key={m.slug}
                className="group relative flex w-[210px] shrink-0 snap-start items-center sm:w-[250px] lg:w-[270px]"
              >
                {/* Huge stylized Rank Number */}
                <div
                  className="w-16 shrink-0 text-center font-black leading-none select-none sm:w-20 lg:w-24"
                  aria-hidden="true"
                >
                  <span className="block text-6xl tracking-tighter text-muted/30 transition-colors duration-200 group-hover:text-deep/80 sm:text-7xl lg:text-8xl">
                    {rank}
                  </span>
                </div>

                {/* Poster & details */}
                <div className="relative min-w-0 flex-1">
                  <Link
                    to={`/phim/${m.slug}`}
                    className="block focus-visible:outline-offset-4"
                  >
                    <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-line bg-sub/60 shadow-xs transition-all duration-300 group-hover:-translate-y-1 group-hover:border-deep/50 group-hover:shadow-glow-sm">
                      <PosterImage
                        src={m.poster}
                        fallback={m.posterFallback}
                        alt=""
                        className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/60 opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover:opacity-100">
                        <span className="flex size-10 items-center justify-center rounded-full bg-deep text-white shadow-glow">
                          <Play className="ml-0.5 size-4.5 fill-white" />
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleQuickPreview(e, m)}
                          className="flex items-center gap-1 rounded-full border border-white/20 bg-white/20 px-2.5 py-0.5 text-[10.5px] font-medium text-white backdrop-blur-md hover:bg-white hover:text-ink"
                        >
                          <Eye className="size-3" />
                          <span>Xem nhanh</span>
                        </button>
                      </div>

                      {/* Top Badges */}
                      <span className="badge-trend absolute top-2 left-2 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                        #{rank} Trend
                      </span>

                      {m.quality && (
                        <span className="badge-quality absolute bottom-2 left-2 rounded px-1.5 py-0.5 text-[10px] font-semibold">
                          {m.quality}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-2 line-clamp-1 text-xs font-bold text-ink transition-colors group-hover:text-deep sm:text-sm">
                      {m.name}
                    </h3>
                    <p className="mt-0.5 truncate text-[11px] text-muted">
                      {[m.year, m.language].filter(Boolean).join(" · ")}
                    </p>
                  </Link>

                  <div className="absolute top-2 right-2 z-10">
                    <FavoriteButton movie={m} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Reveal>
  );
}
