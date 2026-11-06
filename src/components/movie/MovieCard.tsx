import { Eye, Play } from "lucide-react";
import type { MouseEvent } from "react";
import { Link } from "react-router-dom";
import { usePreview } from "../../context/PreviewContext";
import type { Movie } from "../../types/movie";
import { PosterImage } from "../common/PosterImage";
import { FavoriteButton } from "./FavoriteButton";

interface Props {
  movie: Movie;
  eager?: boolean;
  index?: number;
}

export function MovieCard({ movie, eager = false }: Props) {
  const { openPreview } = usePreview();
  const langLower = movie.language?.toLowerCase() ?? "";
  const isDubbed = langLower.includes("lồng tiếng");
  const isVoiceover = !isDubbed && langLower.includes("thuyết minh");

  const handleQuickPreview = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openPreview(movie);
  };

  const isHighQuality = movie.quality?.toLowerCase().includes("4k") || movie.quality?.toLowerCase().includes("fhd");

  return (
    <article className="group relative min-w-0">
      <Link
        to={`/phim/${movie.slug}`}
        className="block focus-visible:outline-offset-4"
        aria-label={`${movie.name}${movie.year ? ` (${movie.year})` : ""}`}
      >
        <div className="relative aspect-[2/3] overflow-hidden rounded-md border border-line bg-sub transition-all duration-200 group-hover:-translate-y-1 group-hover:border-deep/60 group-hover:shadow-lg">
          <PosterImage
            src={movie.poster}
            fallback={movie.posterFallback}
            alt=""
            eager={eager}
            className="size-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/65 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            {/* Play Button màu vàng nổi bật */}
            <span className="flex size-11 items-center justify-center rounded-full bg-play text-black shadow-md transition-transform duration-150 group-hover:scale-105 active:scale-95">
              <Play className="ml-0.5 size-5 fill-black" />
            </span>

            {/* Xem nhanh */}
            <button
              type="button"
              onClick={handleQuickPreview}
              aria-label={`Xem nhanh ${movie.name}`}
              className="mt-1 flex items-center gap-1.5 rounded border border-white/20 bg-black/80 px-2.5 py-1 text-[11px] font-semibold text-white shadow-xs transition-colors hover:bg-white hover:text-black active:scale-95"
            >
              <Eye className="size-3" />
              <span>Xem nhanh</span>
            </button>
          </div>

          {/* Nhãn chất lượng Top Left */}
          {movie.quality && (
            <span
              className={`badge absolute top-2 left-2 px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
                isHighQuality ? "badge-vip" : "badge-quality"
              }`}
            >
              {movie.quality}
            </span>
          )}

          {/* Nhãn tập phim Bottom Left */}
          {movie.currentEpisode && (
            <span className="badge absolute bottom-2 left-2 max-w-[calc(100%-1rem)] truncate bg-black/90 px-2 py-0.5 text-[10.5px] font-medium text-white ring-1 ring-white/10">
              {movie.currentEpisode}
            </span>
          )}

          {/* Nhãn Lồng tiếng / Thuyết minh */}
          {isDubbed && (
            <span className="badge absolute bottom-2 right-2 bg-amber-500 font-extrabold text-black px-1.5 py-0.5 text-[9.5px] tracking-wide uppercase shadow-sm">
              Lồng tiếng
            </span>
          )}
          {isVoiceover && (
            <span className="badge absolute bottom-2 right-2 bg-emerald-600 font-bold text-white px-1.5 py-0.5 text-[9.5px] tracking-wide uppercase shadow-sm">
              Thuyết minh
            </span>
          )}
        </div>

        {/* Thông tin phim */}
        <div className="pt-2">
          <h3 className="line-clamp-2 text-xs font-semibold leading-snug text-ink transition-colors group-hover:text-deep sm:text-[13.5px]">
            {movie.name}
          </h3>
          {movie.originalName && (
            <p className="mt-0.5 truncate text-[11px] text-muted">
              {movie.originalName}
            </p>
          )}
          <p className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] text-muted">
            {movie.year && <span>{movie.year}</span>}
            {movie.year && movie.language && <span>·</span>}
            {movie.language && (
              <span
                className={
                  isDubbed
                    ? "font-semibold text-amber-500"
                    : isVoiceover
                      ? "font-semibold text-emerald-500"
                      : ""
                }
              >
                {movie.language}
              </span>
            )}
          </p>
        </div>
      </Link>

      {/* Nút yêu thích Top Right */}
      <div className="absolute top-2 right-2 z-10 transition-transform duration-150 group-hover:scale-105">
        <FavoriteButton movie={movie} />
      </div>
    </article>
  );
}
