import { Link } from "react-router-dom";
import type { Movie } from "../../types/movie";
import { PosterImage } from "../common/PosterImage";
import { FavoriteButton } from "./FavoriteButton";

interface Props {
  movie: Movie;
  eager?: boolean;
}

export function MovieCard({ movie, eager = false }: Props) {
  const meta = [movie.year, movie.language].filter(Boolean).join(" · ");

  return (
    <article className="group relative min-w-0">
      <Link to={`/phim/${movie.slug}`} className="block rounded-[var(--radius-card)] focus-visible:outline-offset-4">
        <div className="relative aspect-[2/3] overflow-hidden rounded-[var(--radius-card)] border border-line bg-pastel shadow-[var(--shadow-card)] transition-[transform,box-shadow] duration-300 group-hover:-translate-y-1 group-hover:shadow-[var(--shadow-lift)]">
          <PosterImage
            src={movie.poster}
            fallback={movie.posterFallback}
            alt={`Poster phim ${movie.name}`}
            eager={eager}
            className="absolute inset-0 size-full transition-transform duration-500 group-hover:scale-[1.04]"
          />
          {movie.quality && <span className="badge absolute top-2 left-2 bg-white/95 text-deep shadow-sm">{movie.quality}</span>}
          {movie.currentEpisode && (
            <span className="badge absolute bottom-2 left-2 max-w-[calc(100%-1rem)] truncate bg-deep text-white shadow-sm">
              {movie.currentEpisode}
            </span>
          )}
        </div>
        <h3 className="mt-2.5 line-clamp-2 text-[15px] leading-snug font-semibold text-ink transition-colors group-hover:text-deep">
          {movie.name}
        </h3>
        {movie.originalName && <p className="mt-0.5 truncate text-[13px] text-muted">{movie.originalName}</p>}
        {meta && <p className="mt-0.5 truncate text-xs text-muted">{meta}</p>}
      </Link>
      <FavoriteButton movie={movie} className="absolute top-2 right-2" />
    </article>
  );
}
