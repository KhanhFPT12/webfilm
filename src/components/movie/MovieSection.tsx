import type { ReactNode } from "react";
import type { Movie } from "../../types/movie";
import { EmptyState } from "../common/EmptyState";
import { ErrorState } from "../common/ErrorState";
import { CardSkeleton } from "../common/LoadingSkeleton";
import { Reveal } from "../common/Reveal";
import { SectionHeader } from "../common/SectionHeader";
import { MovieCard } from "./MovieCard";

interface Props {
  id: string;
  title: ReactNode;
  subtitle?: string;
  to?: string;
  movies?: Movie[];
  loading: boolean;
  error?: unknown;
  onRetry?: () => void;
  className?: string;
}

const ROW =
  "-mx-4 flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-4 pb-2 scrollbar-none sm:mx-0 sm:grid sm:snap-none sm:grid-cols-3 sm:gap-x-4.5 sm:gap-y-6 sm:overflow-visible sm:px-0 sm:pb-0 md:grid-cols-4 lg:grid-cols-5";
const ITEM =
  "w-[40%] min-w-[140px] max-w-[180px] shrink-0 snap-start sm:w-auto sm:max-w-none sm:min-w-0 sm:[&:nth-child(n+10)]:hidden md:[&:nth-child(n+9)]:hidden lg:[&:nth-child(n+9)]:block";

export function MovieSection({ id, title, subtitle, to, movies, loading, error, onRetry, className = "" }: Props) {
  return (
    <Reveal as="section" labelledBy={id} className={className}>
      <SectionHeader id={id} title={title} subtitle={subtitle} to={to} />
      {error ? (
        <ErrorState error={error} onRetry={onRetry} compact />
      ) : loading && !movies ? (
        <div className={ROW} role="status">
          <span className="sr-only">Đang tải danh sách phim…</span>
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className={ITEM}>
              <CardSkeleton />
            </div>
          ))}
        </div>
      ) : !movies?.length ? (
        <EmptyState title="Chưa có phim nào ở mục này" description="Dữ liệu chưa có sẵn, bạn quay lại sau nhé." />
      ) : (
        <div className={ROW}>
          {movies.slice(0, 10).map((m, i) => (
            <div key={m.slug} className={ITEM}>
              <MovieCard movie={m} index={i} />
            </div>
          ))}
        </div>
      )}
    </Reveal>
  );
}
