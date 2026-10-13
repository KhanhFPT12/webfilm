import type { Movie } from "../../types/movie";
import { GridSkeleton } from "../common/LoadingSkeleton";
import { MovieCard } from "./MovieCard";

export const GRID_CLASS = "grid grid-cols-2 gap-x-3.5 gap-y-6 sm:grid-cols-3 sm:gap-x-5 md:grid-cols-4 lg:grid-cols-5";

interface Props {
  movies?: Movie[];
  loading?: boolean;
  skeletonCount?: number;
  className?: string;
}

export function MovieGrid({ movies, loading, skeletonCount = 20, className = GRID_CLASS }: Props) {
  if (loading && !movies?.length) return <GridSkeleton count={skeletonCount} className={className} />;
  return (
    <div className={`${className} ${loading ? "opacity-60 transition-opacity" : ""}`} aria-busy={loading || undefined}>
      {movies?.map((m, i) => (
        <MovieCard key={m.slug} movie={m} eager={i < 4} />
      ))}
    </div>
  );
}
