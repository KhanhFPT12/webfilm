import { Eye, Play, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { usePreview } from "../../context/PreviewContext";
import type { Movie } from "../../types/movie";
import { truncate } from "../../utils/formatters";
import { ErrorState } from "../common/ErrorState";
import { PosterImage } from "../common/PosterImage";
import { FavoriteButton } from "./FavoriteButton";

interface Props {
  movies?: Movie[];
  loading: boolean;
  error?: unknown;
  onRetry: () => void;
}

const ROTATE_MS = 8000;

export function HeroBanner({ movies, loading, error, onRetry }: Props) {
  const { openPreview } = usePreview();
  const picks = (movies ?? []).filter((m) => m.backdrop && m.description).slice(0, 5);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const featured = picks[index] ?? picks[0] ?? movies?.[0];

  const reduceMotion = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const autoplay = picks.length > 1 && !paused && !reduceMotion;

  useEffect(() => {
    if (!autoplay) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % picks.length), ROTATE_MS);
    return () => clearTimeout(t);
  }, [autoplay, index, picks.length]);

  const metaItems = featured
    ? [featured.year, featured.quality, featured.currentEpisode, featured.time].filter(Boolean)
    : [];

  return (
    <section
      className="relative w-full overflow-hidden border-b border-line/80 bg-sub/30"
      aria-labelledby="hero-heading"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Ambient backdrop glow */}
      {featured?.backdrop && (
        <div
          className="pointer-events-none absolute -top-20 -right-20 h-96 w-96 rounded-full bg-deep/15 blur-3xl transition-opacity duration-700 sm:h-[450px] sm:w-[450px]"
          aria-hidden="true"
        />
      )}

      <div className="container-page relative z-10 py-6 sm:py-9 lg:py-12">
        {/* Tiêu đề trang cho thiết bị di động & tablet (< lg) */}
        <div className="mb-4.5 min-w-0 max-w-full lg:hidden">
          <div className="inline-flex items-center gap-2 rounded-full bg-pastel/50 px-2.5 py-0.5 text-[11px] font-bold tracking-wider text-deep uppercase">
            <Sparkles className="size-3" />
            <span>Góc phim chọn lọc cho Sony</span>
          </div>
          <h1
            id="hero-heading-mobile"
            className="mt-2 text-xl font-extrabold tracking-tight text-ink sm:text-2xl"
          >
            Chọn một bộ phim cho <span className="text-gradient-pink">buổi tối thư giãn</span>.
          </h1>
        </div>

        <div className="grid w-full min-w-0 max-w-full items-center gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-12 xl:gap-14">
          {/* Cột thông tin — Desktop */}
          <div className="order-2 w-full min-w-0 max-w-full lg:order-1">
            <div className="hidden lg:block">
              <div className="inline-flex items-center gap-2 rounded-full border border-deep/20 bg-pastel/50 px-3 py-1 text-xs font-bold tracking-wider text-deep uppercase shadow-xs">
                <Sparkles className="size-3.5" />
                <span>Góc phim chọn lọc cho Sony</span>
              </div>

              <h1
                id="hero-heading"
                className="mt-3 text-2xl font-black tracking-tight text-ink sm:text-3xl lg:text-[36px] lg:leading-tight"
              >
                Chọn một bộ phim cho <span className="text-gradient-pink">buổi tối thư giãn</span>.
              </h1>
            </div>

            {/* Movie Information Card */}
            <div className="border-t border-line/80 pt-4 lg:mt-6 lg:pt-5">
              {loading && !featured ? (
                <div className="space-y-3" aria-hidden="true">
                  <div className="skeleton h-6 w-3/4 rounded" />
                  <div className="skeleton h-4 w-1/3 rounded" />
                  <div className="skeleton h-14 w-full rounded" />
                </div>
              ) : featured ? (
                <div key={featured.slug} className="animate-fade">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="badge-vip rounded-full px-2.5 py-0.5 text-xs font-bold">
                      ★ Nổi bật hôm nay
                    </span>
                    {featured.quality && (
                      <span className="badge-quality rounded-md px-2 py-0.5 text-xs font-semibold">
                        {featured.quality}
                      </span>
                    )}
                    {featured.currentEpisode && (
                      <span className="rounded-md border border-line bg-surface px-2 py-0.5 text-xs font-medium text-muted">
                        {featured.currentEpisode}
                      </span>
                    )}
                  </div>

                  <h2 className="mt-2.5 line-clamp-2 text-xl font-extrabold text-ink sm:text-2xl lg:text-3xl">
                    {featured.name}
                  </h2>

                  {featured.originalName && (
                    <p className="mt-0.5 truncate text-xs font-medium text-muted sm:text-sm">
                      {featured.originalName}
                    </p>
                  )}

                  {metaItems.length > 0 && (
                    <p className="mt-2.5 flex flex-wrap items-center gap-x-2 text-xs text-muted sm:text-[13px]">
                      {metaItems.map((item, idx) => (
                        <span key={item} className="inline-flex items-center gap-2">
                          <span>{item}</span>
                          {idx < metaItems.length - 1 && <span className="text-line" aria-hidden="true">·</span>}
                        </span>
                      ))}
                    </p>
                  )}

                  {featured.description && (
                    <p className="mt-3 line-clamp-3 max-w-xl text-xs leading-relaxed text-ink/80 sm:text-sm">
                      {truncate(featured.description, 240)}
                    </p>
                  )}
                </div>
              ) : null}
            </div>

            {/* Các nút hành động */}
            <div className="mt-6 flex w-full flex-wrap items-center gap-2.5 sm:gap-3">
              {featured ? (
                <>
                  <Link
                    to={`/xem-phim/${featured.slug}`}
                    className="btn-primary shadow-glow-sm h-10.5 px-5 text-xs font-bold sm:h-11 sm:px-6 sm:text-sm"
                  >
                    <Play className="size-4 fill-white" />
                    <span>Xem phim ngay</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => openPreview(featured)}
                    className="btn-secondary h-10.5 px-4 text-xs font-semibold sm:h-11 sm:px-4.5 sm:text-sm"
                  >
                    <Eye className="size-4" />
                    <span>Xem nhanh</span>
                  </button>

                  <Link
                    to={`/phim/${featured.slug}`}
                    className="btn-ghost h-10.5 px-3 text-xs font-medium text-muted hover:text-deep sm:h-11 sm:px-3.5 sm:text-sm"
                  >
                    <span>Chi tiết tác phẩm</span>
                  </Link>
                </>
              ) : (
                <button type="button" disabled className="btn-primary h-10.5 px-5 text-xs sm:h-11 sm:px-6 sm:text-sm">
                  <Play className="size-4" /> Xem phim ngay
                </button>
              )}
            </div>
          </div>

          {/* Cột 2: Hình ảnh Artwork & Filmstrip selector */}
          <div className="order-1 w-full min-w-0 max-w-full lg:order-2">
            {error && !featured ? (
              <ErrorState error={error} onRetry={onRetry} compact />
            ) : (
              <div className="w-full min-w-0 max-w-full space-y-3">
                {/* Khung artwork chuẩn cinema 16:9 */}
                <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-line bg-surface shadow-xs">
                  {featured ? (
                    <Link
                      key={featured.slug}
                      to={`/phim/${featured.slug}`}
                      className="group block size-full focus-visible:outline-offset-2"
                      aria-label={`Xem chi tiết ${featured.name}`}
                    >
                      <PosterImage
                        src={featured.backdrop}
                        fallback={featured.backdropFallback ?? featured.posterFallback}
                        alt={featured.name}
                        eager
                        className="size-full transition-opacity duration-300 group-hover:opacity-95"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                    </Link>
                  ) : (
                    <div className="skeleton size-full" />
                  )}

                  {featured && (
                    <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3">
                      <FavoriteButton movie={featured} />
                    </div>
                  )}
                </div>

                {/* Thumbnail filmstrip chọn phim nổi bật */}
                {picks.length > 1 && (
                  <div
                    className="flex w-full min-w-0 max-w-full items-center gap-2 overflow-x-auto pb-1 scrollbar-none"
                    role="group"
                    aria-label="Chọn phim nổi bật"
                  >
                    <span className="shrink-0 text-[11px] font-medium text-muted">
                      Đang chiếu:
                    </span>
                    {picks.map((m, i) => (
                      <button
                        key={m.slug}
                        type="button"
                        onClick={() => setIndex(i)}
                        aria-label={`Chọn phim ${m.name}`}
                        aria-pressed={i === index}
                        className={`relative h-13 w-9.5 shrink-0 overflow-hidden rounded-md border transition-all sm:h-16 sm:w-11 ${
                          i === index
                            ? "border-deep ring-1 ring-deep shadow-xs"
                            : "border-line opacity-60 hover:opacity-100"
                        }`}
                      >
                        <PosterImage
                          src={m.poster}
                          fallback={m.posterFallback}
                          alt=""
                          className="size-full"
                        />
                        {i === index && autoplay && (
                          <span
                            key={`bar-${index}`}
                            className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-deep"
                            style={{ animation: `progress ${ROTATE_MS}ms linear forwards` }}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
