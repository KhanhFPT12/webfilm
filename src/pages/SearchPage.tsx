import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { EmptyState } from "../components/common/EmptyState";
import { ErrorState } from "../components/common/ErrorState";
import { Pagination } from "../components/common/Pagination";
import { MovieGrid } from "../components/movie/MovieGrid";
import { useSearch } from "../hooks/useMovies";
import { useDebounce, useDocumentTitle } from "../hooks/useUtils";
import { FEATURED_GENRES, GENRES } from "../utils/catalog";
import { formatNumber } from "../utils/formatters";

const MIN_LENGTH = 2;

export function SearchPage() {
  const [params, setParams] = useSearchParams();
  const urlQuery = params.get("q") ?? "";
  const page = Math.max(1, Number.parseInt(params.get("page") ?? "1", 10) || 1);

  const [input, setInput] = useState(urlQuery);
  const debounced = useDebounce(input, 450);
  const inputRef = useRef<HTMLInputElement>(null);

  // URL đổi từ bên ngoài (header, back/forward) -> cập nhật ô nhập.
  useEffect(() => {
    setInput((cur) => (cur.trim() === urlQuery.trim() ? cur : urlQuery));
  }, [urlQuery]);

  // Gõ xong (debounce) -> đồng bộ lên URL, về trang 1.
  useEffect(() => {
    const q = debounced.trim();
    if (q === urlQuery.trim()) return;
    const next = new URLSearchParams();
    if (q) next.set("q", q);
    setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  useEffect(() => {
    if (!urlQuery) inputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const keyword = urlQuery.trim();
  const { data, loading, error, reload } = useSearch(keyword, page);
  useDocumentTitle(keyword ? `Tìm “${keyword}”` : "Tìm kiếm");

  const goTo = (p: number) => {
    const next = new URLSearchParams(params);
    if (p <= 1) next.delete("page");
    else next.set("page", String(p));
    setParams(next);
  };

  const typing = input.trim() !== keyword;
  const tooShort = keyword.length > 0 && keyword.length < MIN_LENGTH;

  return (
    <>
      <div className="bg-dots border-b border-line bg-pastel">
        <div className="container-page py-8 sm:py-10">
          <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Phim dành cho bạn</h1>
          <p className="mt-1.5 text-muted">Tìm theo tên tiếng Việt hoặc tên gốc của phim.</p>
          <form
            role="search"
            className="relative mt-5 max-w-2xl"
            onSubmit={(e) => {
              e.preventDefault();
              const q = input.trim();
              setParams(q ? { q } : {}, { replace: false });
            }}
          >
            <label htmlFor="search-page" className="sr-only">
              Từ khoá tìm kiếm
            </label>
            <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted" />
            <input
              id="search-page"
              ref={inputRef}
              type="search"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ví dụ: Yêu như lần đầu, Love Again…"
              autoComplete="off"
              enterKeyHint="search"
              className="input h-13 rounded-xl pr-12 pl-12 text-base shadow-[var(--shadow-card)] [&::-webkit-search-cancel-button]:hidden"
            />
            {input && (
              <button
                type="button"
                onClick={() => {
                  setInput("");
                  setParams({}, { replace: true });
                  inputRef.current?.focus();
                }}
                className="absolute top-1/2 right-2.5 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted hover:bg-pastel hover:text-deep"
                aria-label="Xoá từ khoá"
              >
                <X className="size-5" />
              </button>
            )}
          </form>
        </div>
      </div>

      <div className="container-page py-8 sm:py-10" aria-live="polite">
        {!keyword ? (
          <EmptyState
            title="Bạn muốn xem gì hôm nay?"
            description="Gõ tên phim vào ô phía trên, hoặc bắt đầu từ một thể loại quen thuộc."
            action={GENRES.filter((g) => FEATURED_GENRES.includes(g.slug)).map((g) => (
              <Link key={g.slug} to={`/the-loai/${g.slug}`} className="chip">
                {g.name}
              </Link>
            ))}
          />
        ) : tooShort ? (
          <EmptyState title="Từ khoá hơi ngắn" description={`Hãy nhập ít nhất ${MIN_LENGTH} ký tự để tìm phim nhé.`} />
        ) : error ? (
          <ErrorState error={error} onRetry={reload} />
        ) : !loading && data && data.items.length === 0 ? (
          <EmptyState
            title={`Không tìm thấy phim nào cho “${keyword}”`}
            description="Thử kiểm tra chính tả, bỏ dấu hoặc tìm theo tên gốc (tiếng Anh, tiếng Hàn…)."
            action={
              <Link to="/phim-moi" className="btn-secondary">
                Xem phim mới cập nhật
              </Link>
            }
          />
        ) : (
          <>
            <p className="mb-5 text-sm text-muted">
              {loading && !data ? (
                "Đang tìm…"
              ) : data ? (
                <>
                  Tìm thấy <strong className="text-deep">{formatNumber(data.totalItems)}</strong> phim cho “{keyword}”
                  {data.totalPages > 1 && ` · Trang ${page}/${formatNumber(data.totalPages)}`}
                </>
              ) : null}
            </p>
            <div className={typing ? "opacity-60 transition-opacity" : ""}>
              <MovieGrid movies={data?.items} loading={loading} />
            </div>
            {data && <Pagination page={page} totalPages={data.totalPages} onChange={goTo} />}
          </>
        )}
      </div>
    </>
  );
}
