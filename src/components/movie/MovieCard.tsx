import { Play } from "lucide-react";
import { Link } from "react-router-dom";
import type { Movie } from "../../types/movie";
import { PosterImage } from "../common/PosterImage";
import { FavoriteButton } from "./FavoriteButton";

interface Props {
  movie: Movie;
  eager?: boolean;
  index?: number;
}

export function MovieCard({ movie, eager = false }: Props) {
  const meta = [movie.year, movie.language].filter(Boolean).join(" · ");

  return (
    <article className="group relative min-w-0">
      <Link
        to={`/phim/${movie.slug}`}
        className="block focus-visible:outline-offset-4"
        aria-label={`${movie.name}${movie.year ? ` (${movie.year})` : ""}`}
      >
        <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-line bg-sub/60 shadow-xs transition-all duration-200 group-hover:-translate-y-1 group-hover:border-deep/30 group-hover:shadow-md">
          <PosterImage
            src={movie.poster}
            fallback={movie.posterFallback}
            alt=""
            eager={eager}
            className="size-full transition-transform duration-300 group-hover:scale-[1.03]"
          />

          {/* Hover play overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <span className="flex size-10 items-center justify-center rounded-full bg-deep text-white shadow-sm transition-transform duration-150 group-hover:scale-100">
              <Play className="ml-0.5 size-4.5 fill-white" />
            </span>
          </div>

          {/* Nhãn tập / bản phim */}
          {movie.currentEpisode && (
            <span className="badge absolute bottom-2 left-2 max-w-[calc(100%-1rem)] truncate bg-black/75 px-2 py-0.5 text-[10.5px] font-medium text-white backdrop-blur-xs">
              {movie.currentEpisode}
            </span>
          )}

          {/* Nhãn chất lượng */}
          {movie.quality && !movie.currentEpisode && (
            <span className="badge absolute top-2 left-2 bg-surface/90 px-1.5 py-0.5 text-[10px] font-semibold text-deep shadow-xs backdrop-blur-xs">
              {movie.quality}
            </span>
          )}
        </div>

        <h3 className="mt-2.5 line-clamp-2 text-xs sm:text-[13.5px] font-semibold leading-snug text-ink transition-colors group-hover:text-deep">
          {movie.name}
        </h3>
        {movie.originalName && (
          <p className="mt-0.5 truncate text-[11.5px] text-muted">
            {movie.originalName}
          </p>
        )}
        {meta && (
          <p className="mt-0.5 truncate text-[11px] text-muted/80">
            {meta}
          </p>
        )}
      </Link>

      <div className="absolute top-2 right-2">
        <FavoriteButton movie={movie} />
      </div>
    </article>
  );
}
