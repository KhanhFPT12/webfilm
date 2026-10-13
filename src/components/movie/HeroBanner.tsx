import { Compass, Play, Star } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
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

/** Trái tim nhỏ trang trí — chỉ đặt ở rìa, không che nội dung. */
function HeartDeco({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 21s-8-4.9-8-11a4.6 4.6 0 0 1 8-3 4.6 4.6 0 0 1 8 3c0 6.1-8 11-8 11z" fill="currentColor" />
    </svg>
  );
}

export function HeroBanner({ movies, loading, error, onRetry }: Props) {
  // Chỉ chọn phim nổi bật có đủ ảnh ngang + mô tả từ dữ liệu thật.
  const picks = (movies ?? []).filter((m) => m.backdrop && m.description).slice(0, 5);
  const [index, setIndex] = useState(0);
  const featured = picks[index] ?? picks[0] ?? movies?.[0];

  const meta = featured ? [featured.year, featured.quality, featured.currentEpisode, featured.time].filter(Boolean) : [];

  return (
    <section className="relative overflow-hidden border-b border-line bg-pastel" aria-labelledby="hero-title">
      <HeartDeco className="absolute top-6 left-[46%] hidden size-4 text-rose/50 lg:block" />
      <HeartDeco className="absolute bottom-10 left-4 size-3 text-rose/40" />
      <Star className="absolute top-10 right-6 hidden size-4 fill-rose/30 text-rose/40 lg:block" aria-hidden="true" />

      <div className="container-page grid items-center gap-8 py-8 sm:py-12 lg:grid-cols-[1fr_1.15fr] lg:gap-12 lg:py-14">
        {/* Cột chữ */}
        <div className="order-2 min-w-0 lg:order-1">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-deep ring-1 ring-line">
            <Star className="size-3.5 fill-deep" aria-hidden="true" /> Rạp hồng hôm nay
          </p>
          <h1 id="hero-title" className="mt-4 text-[28px] leading-tight font-extrabold tracking-tight text-ink sm:text-4xl lg:text-[44px]">
            Một bộ phim, một chút yêu thương <span aria-hidden="true">💗</span>
          </h1>
          <p className="mt-3 text-base text-muted sm:text-lg">Tìm bộ phim dành cho tâm trạng hôm nay của bạn.</p>

          <div className="mt-6 border-l-[3px] border-deep pl-4">
            {loading && !featured ? (
              <div className="space-y-2.5" aria-hidden="true">
                <div className="skeleton h-6 w-2/3 rounded" />
                <div className="skeleton h-4 w-1/3 rounded" />
                <div className="skeleton h-14 w-full rounded" />
              </div>
            ) : featured ? (
              <>
                <p className="text-xs font-semibold tracking-wider text-deep uppercase">Phim nổi bật</p>
                <h2 className="mt-1 line-clamp-2 text-xl font-bold text-ink sm:text-2xl">{featured.name}</h2>
                {featured.originalName && <p className="mt-0.5 truncate text-sm text-muted">{featured.originalName}</p>}
                {meta.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {meta.map((m) => (
                      <span key={m} className="badge bg-white text-ink ring-1 ring-line">
                        {m}
                      </span>
                    ))}
                  </div>
                )}
                {featured.description && (
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink/80">{truncate(featured.description, 260)}</p>
                )}
              </>
            ) : null}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {featured ? (
              <>
                <Link to={`/xem-phim/${featured.slug}`} className="btn-primary h-12 px-6 text-[15px]">
                  <Play className="size-4 fill-white" /> Xem ngay
                </Link>
                <Link to={`/phim/${featured.slug}`} className="btn-secondary h-12 px-5 text-[15px]">
                  Chi tiết
                </Link>
              </>
            ) : (
              <button type="button" disabled className="btn-primary h-12 px-6">
                <Play className="size-4" /> Xem ngay
              </button>
            )}
            <Link to="/phim-moi" className="btn-ghost h-12 px-4 text-[15px]">
              <Compass className="size-4" /> Khám phá phim
            </Link>
          </div>
        </div>

        {/* Cột ảnh */}
        <div className="order-1 min-w-0 lg:order-2">
          {error && !featured ? (
            <ErrorState error={error} onRetry={onRetry} compact />
          ) : (
            <div className="relative">
              <div className="relative aspect-video overflow-hidden rounded-xl border-4 border-white bg-white shadow-[var(--shadow-lift)]">
                {featured ? (
                  <Link to={`/phim/${featured.slug}`} tabIndex={-1} aria-hidden="true">
                    <PosterImage
                      src={featured.backdrop}
                      fallback={featured.backdropFallback ?? featured.posterFallback}
                      alt=""
                      eager
                      className="absolute inset-0 size-full"
                    />
                  </Link>
                ) : (
                  <div className="skeleton absolute inset-0" />
                )}
                {featured && <FavoriteButton movie={featured} className="absolute top-3 right-3" />}
              </div>

              {/* Poster dọc chồng góc — chỉ desktop */}
              {featured && (
                <div className="absolute -bottom-6 -left-6 hidden w-28 overflow-hidden rounded-lg border-4 border-white shadow-[var(--shadow-lift)] xl:block">
                  <PosterImage src={featured.poster} fallback={featured.posterFallback} alt="" eager className="aspect-[2/3] w-full" />
                </div>
              )}

              {picks.length > 1 && (
                <div className="mt-4 flex justify-end gap-2" role="group" aria-label="Chọn phim nổi bật">
                  {picks.map((m, i) => (
                    <button
                      key={m.slug}
                      type="button"
                      onClick={() => setIndex(i)}
                      aria-label={`Hiển thị ${m.name}`}
                      aria-pressed={i === index}
                      className={`h-14 w-10 overflow-hidden rounded-md border-2 transition-[border-color,opacity] sm:h-16 sm:w-11 ${
                        i === index ? "border-deep" : "border-white opacity-70 hover:opacity-100"
                      }`}
                    >
                      <PosterImage src={m.poster} fallback={m.posterFallback} alt="" className="size-full" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
