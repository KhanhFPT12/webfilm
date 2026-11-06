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

/** Ô tìm kiếm phim chuyên nghiệp với dropdown kết quả thời gian thực */
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

  // Global Ctrl+K / Cmd+K listener
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

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Tìm kiếm tức thì khi gõ
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
          placeholder="Tìm phim, diễn viên… (Ctrl+K)"
          autoComplete="off"
          enterKeyHint="search"
          className="h-9 w-full rounded-md border border-line bg-sub/80 pr-16 pl-9 text-xs text-ink placeholder:text-muted/60 transition-colors outline-none focus:border-deep focus:bg-surface focus:ring-1 focus:ring-deep sm:text-sm [&::-webkit-search-cancel-button]:hidden"
        />

        <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-1.5">
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
              className="flex size-5 items-center justify-center rounded text-muted hover:text-ink"
              aria-label="Xoá từ khoá"
            >
              <X className="size-3" />
            </button>
          )}
          <span className="hidden rounded border border-line bg-surface px-1.5 py-0.5 text-[9px] font-medium text-muted lg:inline-block">
            ⌘K
          </span>
        </div>
      </form>

      {/* Dropdown gợi ý kết quả trực tiếp */}
      {openDropdown && value.trim().length >= 2 && (
        <div className="absolute top-full right-0 left-0 z-50 mt-1.5 overflow-hidden rounded-lg border border-line bg-surface p-1.5 shadow-2xl animate-rise min-w-[320px] max-w-[420px] sm:min-w-[380px]">
          {loading && results.length === 0 ? (
            <div className="flex items-center justify-center gap-2 py-6 text-xs text-muted">
              <Loader2 className="size-4 animate-spin text-deep" />
              <span>Đang tìm kiếm phim…</span>
            </div>
          ) : results.length > 0 ? (
            <div className="divide-y divide-line/60">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted">
                Kết quả phù hợp
              </div>
              <div className="space-y-0.5 py-1">
                {results.map((m) => (
                  <button
                    key={m.slug}
                    type="button"
                    onClick={() => handleSelectMovie(m.slug)}
                    className="group flex w-full items-center gap-3 rounded-md p-2 text-left transition-colors hover:bg-sub"
                  >
                    <div className="relative h-12 w-8.5 shrink-0 overflow-hidden rounded border border-line bg-sub">
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
                          <span className="rounded bg-black/60 px-1 py-0.2 text-[9px] font-bold text-white border border-white/10">
                            {m.quality}
                          </span>
                        )}
                        {m.currentEpisode && <span>· {m.currentEpisode}</span>}
                      </div>
                    </div>
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-sub text-muted transition-all group-hover:bg-play group-hover:text-black">
                      <Play className="ml-0.5 size-3 fill-current" />
                    </span>
                  </button>
                ))}
              </div>

              <div className="pt-1.5">
                <Link
                  to={`/tim-kiem?q=${encodeURIComponent(value.trim())}`}
                  onClick={() => setOpenDropdown(false)}
                  className="flex items-center justify-between rounded-md px-3 py-2 text-xs font-semibold text-deep hover:bg-sub"
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
