import { useGenreMovies } from "../../hooks/useMovies";
import type { MovieDetail } from "../../types/movie";
import { MovieSection } from "./MovieSection";

/** Phim liên quan: lấy từ thể loại đầu tiên (đã xác minh slug) của phim hiện tại. */
export function RelatedMovies({ movie }: { movie: MovieDetail }) {
  const genre = movie.genres.find((g) => g.slug);
  const { data, loading, error, reload } = useGenreMovies(genre?.slug, 1);
  if (!genre) return null;
  const items = data?.items.filter((m) => m.slug !== movie.slug);
  return (
    <MovieSection
      id="related-title"
      title="Có thể bạn cũng thích"
      subtitle={`Cùng thể loại ${genre.name.toLowerCase()}`}
      to={`/the-loai/${genre.slug}`}
      movies={items}
      loading={loading}
      error={error}
      onRetry={reload}
    />
  );
}
