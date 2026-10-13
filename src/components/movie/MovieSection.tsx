import type { ReactNode } from "react";
import type { Movie } from "../../types/movie";
import { EmptyState } from "../common/EmptyState";
import { ErrorState } from "../common/ErrorState";
import { CardSkeleton } from "../common/LoadingSkeleton";
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

/**
 * Một hàng phim trên trang chủ.
 * - Mobile: hàng cuộn ngang có snap, card rộng ~42% màn hình (poster không bị nhỏ).
 * - Tablet trở lên: lưới 4–5 cột, hiển thị số card chia hết cho số cột.
 */
const ROW =
  "-mx-4 flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-4 pb-2 scrollbar-none sm:mx-0 sm:grid sm:snap-none sm:grid-cols-3 sm:gap-x-5 sm:gap-y-6 sm:overflow-visible sm:px-0 sm:pb-0 md:grid-cols-4 lg:grid-cols-5";
const ITEM =
  "w-[42%] min-w-[150px] max-w-[200px] shrink-0 snap-start sm:w-auto sm:max-w-none sm:min-w-0 sm:[&:nth-child(n+10)]:hidden md:[&:nth-child(n+9)]:hidden lg:[&:nth-child(n+9)]:block";

export function MovieSection({ id, title, subtitle, to, movies, loading, error, onRetry, className = "" }: Props) {
  return (
    <section aria-labelledby={id} className={className}>
      <SectionHeader id={id} title={title} subtitle={subtitle} to={to} />
      {error ? (
        <ErrorState error={error} onRetry={onRetry} compact />
      ) : loading && !movies ? (
        <div className={ROW} role="status">
          <span className="sr-only">Đang tải…</span>
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className={ITEM}>
              <CardSkeleton />
            </div>
          ))}
        </div>
      ) : !movies?.length ? (
        <EmptyState title="Chưa có phim nào ở đây" description="Máy chủ chưa trả về phim cho mục này. Bạn quay lại sau nhé." />
      ) : (
        <div className={ROW}>
          {movies.slice(0, 10).map((m) => (
            <div key={m.slug} className={ITEM}>
              <MovieCard movie={m} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
