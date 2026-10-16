import { Compass, Play, Sparkles, Star } from "lucide-react";
import { useEffect, useState, type CSSProperties } from "react";
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

const ROTATE_MS = 7000;

function HeartShape({ className, style }: { className: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden="true">
      <path d="M12 21s-8-4.9-8-11a4.6 4.6 0 0 1 8-3 4.6 4.6 0 0 1 8 3c0 6.1-8 11-8 11z" fill="currentColor" />
    </svg>
  );
}

/** Đồ trang trí trôi nhẹ — chỉ ở rìa, không che nội dung. */
const DECOS: { kind: "heart" | "star"; className: string; style: CSSProperties }[] = [
  {
    kind: "heart",
    className: "top-6 left-[44%] hidden size-5 text-rose/50 lg:block",
    style: { "--d": "6s", "--r": "-12deg" } as CSSProperties,
  },
  {
    kind: "heart",
    className: "bottom-8 left-3 size-4 text-rose/40",
    style: { "--d": "7s", "--delay": "-2s", "--r": "10deg" } as CSSProperties,
  },
  {
    kind: "star",
    className: "top-8 right-5 hidden size-5 text-rose/50 lg:block",
    style: { "--d": "8s", "--delay": "-1s" } as CSSProperties,
  },
  {
    kind: "heart",
    className: "top-1/2 right-2 hidden size-3 text-accent/40 xl:block",
    style: { "--d": "5s", "--delay": "-3s", "--r": "20deg" } as CSSProperties,
  },
  {
    kind: "star",
    className: "bottom-6 left-[40%] hidden size-3.5 text-rose/40 lg:block",
    style: { "--d": "9s", "--delay": "-4s" } as CSSProperties,
  },
];

export function HeroBanner({ movies, loading, error, onRetry }: Props) {
  // Chỉ chọn phim nổi bật có đủ ảnh ngang + mô tả từ dữ liệu thật.
  const picks = (movies ?? []).filter((m) => m.backdrop && m.description).slice(0, 5);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const featured = picks[index] ?? picks[0] ?? movies?.[0];

  // Tự chuyển phim nổi bật; dừng khi rê chuột / focus, hoặc khi người dùng giảm chuyển động.
  const reduceMotion = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const autoplay = picks.length > 1 && !paused && !reduceMotion;
  useEffect(() => {
    if (!autoplay) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % picks.length), ROTATE_MS);
    return () => clearTimeout(t);
  }, [autoplay, index, picks.length]);

  const meta = featured ? [featured.year, featured.quality, featured.currentEpisode, featured.time].filter(Boolean) : [];

  return (
    <section
      className="bg-dots relative overflow-hidden border-b border-line bg-pastel"
      aria-labelledby="hero-title"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {DECOS.map((d, i) =>
        d.kind === "heart" ? (
          <HeartShape key={i} className={`animate-float absolute ${d.className}`} style={d.style} />
        ) : (
          <Star key={i} className={`animate-float absolute fill-current ${d.className}`} style={d.style} aria-hidden="true" />
        ),
      )}

      <div className="container-page relative grid items-center gap-8 py-8 sm:py-12 lg:grid-cols-[1fr_1.15fr] lg:gap-12 lg:py-16">
        {/* Cột chữ */}
        <div className="order-2 min-w-0 lg:order-1">
          <p className="animate-rise inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-xs font-semibold text-deep shadow-sm ring-1 ring-line">
            <Sparkles className="size-3.5" aria-hidden="true" /> Rạp hồng hôm nay
          </p>
          <h1
            id="hero-title"
            className="animate-rise mt-4 text-[28px] leading-tight font-extrabold tracking-tight text-ink sm:text-4xl lg:text-[46px]"
            style={{ ["--i" as string]: 1 }}
          >
            Một bộ phim, <span className="text-deep">một chút yêu thương</span>{" "}
            <span className="animate-heartbeat inline-block" aria-hidden="true">
              💗
            </span>
          </h1>
          <p className="animate-rise mt-3 text-base text-muted sm:text-lg" style={{ ["--i" as string]: 2 }}>
            Tìm bộ phim dành cho tâm trạng hôm nay của bạn.
          </p>

          <div
            className="animate-rise mt-6 rounded-2xl bg-surface/80 p-4 shadow-[var(--shadow-card)] ring-1 ring-line"
            style={{ ["--i" as string]: 3 }}
          >
            {loading && !featured ? (
              <div className="space-y-2.5" aria-hidden="true">
                <div className="skeleton h-6 w-2/3 rounded" />
                <div className="skeleton h-4 w-1/3 rounded" />
                <div className="skeleton h-14 w-full rounded" />
              </div>
            ) : featured ? (
              <div key={featured.slug} className="animate-fade">
                <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-deep uppercase">
                  <HeartShape className="size-3" /> Phim nổi bật
                </p>
                <h2 className="mt-1 line-clamp-2 text-xl font-bold text-ink sm:text-2xl">{featured.name}</h2>
                {featured.originalName && <p className="mt-0.5 truncate text-sm text-muted">{featured.originalName}</p>}
                {meta.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {meta.map((m) => (
                      <span key={m} className="badge rounded-full bg-pastel px-2 text-deep">
                        {m}
                      </span>
                    ))}
                  </div>
                )}
                {featured.description && (
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink/80">{truncate(featured.description, 260)}</p>
                )}
              </div>
            ) : null}
          </div>

          <div className="animate-rise mt-6 flex flex-wrap gap-3" style={{ ["--i" as string]: 4 }}>
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
        <div className="animate-rise order-1 min-w-0 lg:order-2" style={{ ["--i" as string]: 2 }}>
          {error && !featured ? (
            <ErrorState error={error} onRetry={onRetry} compact />
          ) : (
            <div className="relative">
              <div className="relative aspect-video overflow-hidden rounded-2xl border-4 border-surface bg-surface shadow-[var(--shadow-lift)] lg:rotate-1">
                {featured ? (
                  <Link
                    key={featured.slug}
                    to={`/phim/${featured.slug}`}
                    tabIndex={-1}
                    aria-hidden="true"
                    className="animate-zoom-fade absolute inset-0"
                  >
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
                <div
                  key={`p-${featured.slug}`}
                  className="animate-rise absolute -bottom-6 -left-6 hidden w-28 -rotate-6 overflow-hidden rounded-xl border-4 border-surface shadow-[var(--shadow-lift)] xl:block"
                >
                  <PosterImage src={featured.poster} fallback={featured.posterFallback} alt="" eager className="aspect-[2/3] w-full" />
                </div>
              )}

              {picks.length > 1 && (
                <div className="mt-5 flex justify-end gap-2" role="group" aria-label="Chọn phim nổi bật">
                  {picks.map((m, i) => (
                    <button
                      key={m.slug}
                      type="button"
                      onClick={() => setIndex(i)}
                      aria-label={`Hiển thị ${m.name}`}
                      aria-pressed={i === index}
                      className={`relative h-14 w-10 overflow-hidden rounded-lg border-2 transition-all duration-300 [transition-timing-function:var(--ease-bounce)] sm:h-16 sm:w-11 ${
                        i === index
                          ? "-translate-y-1 border-deep shadow-md"
                          : "border-surface opacity-70 hover:-translate-y-0.5 hover:opacity-100"
                      }`}
                    >
                      <PosterImage src={m.poster} fallback={m.posterFallback} alt="" className="size-full" />
                      {/* Thanh tiến trình tự chuyển */}
                      {i === index && autoplay && (
                        <span
                          key={`bar-${index}`}
                          className="absolute inset-x-0 bottom-0 h-1 origin-left bg-deep"
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
    </section>
  );
}
