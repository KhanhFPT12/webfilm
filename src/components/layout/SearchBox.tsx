import { ArrowRight, Loader2, Play, Search, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { searchMovies } from "../../api/movies";
import type { Movie } from "../../types/movie";
import { PosterImage } from "../common/PosterImage";

interface Props {
  className?: string;
  autoFocus?: boolean;
  onSubmitted?: () => void;
}

/** Ô tìm kiếm ở header với dropdown kết quả trực tiếp thông minh */
export function SearchBox({ className = "", autoFocus, onSubmitted }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const urlQuery = location.pathname === "/tim-kiem" ? (params.get("q") ?? "") : "";
  const [value, setValue] = useState(urlQuery);
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => setValue(urlQuery), [urlQuery]);

  // Global Ctrl+K / Cmd+K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
      if (e.key === "Escape") {
        setOpenDropdown(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Live Instant Search with debounce
  useEffect(() => {
    const q = value.trim();
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await searchMovies(q, 1);
        setResults(res.items.slice(0, 5));
        setOpenDropdown(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [value]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    setOpenDropdown(false);
    navigate(q ? `/tim-kiem?q=${encodeURIComponent(q)}` : "/tim-kiem");
    onSubmitted?.();
  };

  const handleSelectMovie = (slug: string) => {
    setOpenDropdown(false);
    navigate(`/phim/${slug}`);
    onSubmitted?.();
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form role="search" onSubmit={submit} className="relative w-full">
        <label htmlFor={autoFocus ? "search-mobile" : "search-header"} className="sr-only">
          Tìm phim
        </label>
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
        <input
          ref={inputRef}
          id={autoFocus ? "search-mobile" : "search-header"}
          type="search"
          value={value}
          autoFocus={autoFocus}
          onFocus={() => {
            if (results.length > 0) setOpenDropdown(true);
          }}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Tìm tên phim, diễn viên… (Ctrl+K)"
          autoComplete="off"
          enterKeyHint="search"
          className="h-10 w-full rounded-xl border border-line bg-sub/60 pr-16 pl-9 text-xs text-ink placeholder:text-muted/70 transition-all outline-none focus:border-deep focus:bg-surface focus:ring-2 focus:ring-deep/20 sm:text-sm [&::-webkit-search-cancel-button]:hidden"
        />

        <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-1">
          {loading && <Loader2 className="size-3.5 animate-spin text-deep" />}
          {value && !loading && (
            <button
              type="button"
              onClick={() => {
                setValue("");
                setResults([]);
                setOpenDropdown(false);
                inputRef.current?.focus();
              }}
              className="flex size-6 items-center justify-center rounded text-muted hover:text-deep"
              aria-label="Xoá từ khoá"
            >
              <X className="size-3.5" />
            </button>
          )}
          <span className="hidden rounded border border-line bg-surface px-1.5 py-0.5 text-[10px] font-medium text-muted lg:inline-block">
            ⌘K
          </span>
        </div>
      </form>

      {/* Floating Instant Search Dropdown */}
      {openDropdown && value.trim().length >= 2 && (
        <div className="absolute top-full right-0 left-0 z-50 mt-1.5 overflow-hidden rounded-2xl border border-line/90 bg-surface/98 p-1.5 shadow-2xl backdrop-blur-xl animate-rise min-w-[320px] max-w-[420px] sm:min-w-[380px]">
          {loading && results.length === 0 ? (
            <div className="flex items-center justify-center gap-2 py-6 text-xs text-muted">
              <Loader2 className="size-4 animate-spin text-deep" />
              <span>Đang tìm kiếm phim…</span>
            </div>
          ) : results.length > 0 ? (
            <div className="divide-y divide-line/40">
              <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">
                Gợi ý nhanh
              </div>
              <div className="space-y-1 py-1">
                {results.map((m) => (
                  <button
                    key={m.slug}
                    type="button"
                    onClick={() => handleSelectMovie(m.slug)}
                    className="group flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-sub/80"
                  >
                    <div className="relative h-13 w-9.5 shrink-0 overflow-hidden rounded-lg border border-line bg-sub">
                      <PosterImage
                        src={m.poster}
                        fallback={m.posterFallback}
                        alt=""
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-ink group-hover:text-deep sm:text-sm">
                        {m.name}
                      </p>
                      {m.originalName && (
                        <p className="truncate text-[11px] text-muted">
                          {m.originalName}
                        </p>
                      )}
                      <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-muted">
                        {m.year && <span>{m.year}</span>}
                        {m.quality && (
                          <span className="rounded bg-pastel/60 px-1 py-0.2 font-semibold text-deep">
                            {m.quality}
                          </span>
                        )}
                        {m.currentEpisode && <span>· {m.currentEpisode}</span>}
                      </div>
                    </div>
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-sub text-muted opacity-0 transition-all group-hover:opacity-100 group-hover:bg-deep group-hover:text-white">
                      <Play className="ml-0.5 size-3 fill-current" />
                    </span>
                  </button>
                ))}
              </div>

              <div className="pt-1.5">
                <Link
                  to={`/tim-kiem?q=${encodeURIComponent(value.trim())}`}
                  onClick={() => setOpenDropdown(false)}
                  className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-deep hover:bg-pastel/40"
                >
                  <span>Xem tất cả kết quả cho “{value.trim()}”</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-muted">
              Không tìm thấy phim phù hợp với “{value.trim()}”
            </div>
          )}
        </div>
      )}
    </div>
  );
}
