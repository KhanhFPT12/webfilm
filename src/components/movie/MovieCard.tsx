import { Play } from "lucide-react";
import { Link } from "react-router-dom";
import type { Movie } from "../../types/movie";
import { PosterImage } from "../common/PosterImage";
import { FavoriteButton } from "./FavoriteButton";

interface Props {
  movie: Movie;
  eager?: boolean;
  /** Thứ tự trong lưới — dùng để các card hiện lần lượt. */
  index?: number;
}

export function MovieCard({ movie, eager = false, index = 0 }: Props) {
  const meta = [movie.year, movie.language].filter(Boolean).join(" · ");

  return (
    <article className="group animate-rise relative min-w-0" style={{ ["--i" as string]: Math.min(index, 12) }}>
      <Link to={`/phim/${movie.slug}`} className="block rounded-[var(--radius-card)] focus-visible:outline-offset-4">
        <div className="relative aspect-[2/3] overflow-hidden rounded-[var(--radius-card)] border border-line bg-pastel shadow-[var(--shadow-card)] transition-[transform,box-shadow] duration-500 [transition-timing-function:var(--ease-bounce)] group-hover:-translate-y-1.5 group-hover:-rotate-1 group-hover:shadow-[var(--shadow-lift)]">
          <PosterImage
            src={movie.poster}
            fallback={movie.posterFallback}
            alt={`Poster phim ${movie.name}`}
            eager={eager}
            className="absolute inset-0 size-full transition-transform duration-700 group-hover:scale-[1.07]"
          />
          {/* Lớp hồng mỏng + nút play khi rê chuột */}
          <div className="absolute inset-0 flex items-center justify-center bg-deep/0 transition-colors duration-300 group-hover:bg-deep/20">
            <span className="flex size-12 scale-50 items-center justify-center rounded-full bg-surface/95 text-deep opacity-0 shadow-lg transition-all duration-300 [transition-timing-function:var(--ease-bounce)] group-hover:scale-100 group-hover:opacity-100">
              <Play className="ml-0.5 size-5 fill-deep" />
            </span>
          </div>
          {movie.quality && <span className="badge absolute top-2 left-2 bg-surface/95 text-deep shadow-sm">{movie.quality}</span>}
          {movie.currentEpisode && (
            <span className="badge absolute bottom-2 left-2 max-w-[calc(100%-1rem)] truncate rounded-full bg-deep px-2 text-white shadow-sm">
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
