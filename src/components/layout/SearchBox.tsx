import { Search, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

interface Props {
  className?: string;
  autoFocus?: boolean;
  onSubmitted?: () => void;
}

/** Ô tìm kiếm ở header: tinh tế, cân đối, phản hồi nhanh */
export function SearchBox({ className = "", autoFocus, onSubmitted }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const urlQuery = location.pathname === "/tim-kiem" ? (params.get("q") ?? "") : "";
  const [value, setValue] = useState(urlQuery);

  useEffect(() => setValue(urlQuery), [urlQuery]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    navigate(q ? `/tim-kiem?q=${encodeURIComponent(q)}` : "/tim-kiem");
    onSubmitted?.();
  };

  return (
    <form role="search" onSubmit={submit} className={`relative ${className}`}>
      <label htmlFor={autoFocus ? "search-mobile" : "search-header"} className="sr-only">
        Tìm phim
      </label>
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
      <input
        id={autoFocus ? "search-mobile" : "search-header"}
        type="search"
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Tìm tên phim, diễn viên…"
        autoComplete="off"
        enterKeyHint="search"
        className="h-9.5 w-full rounded-lg border border-line bg-sub/60 pr-8 pl-9 text-xs text-ink placeholder:text-muted/80 transition-colors outline-none focus:border-deep focus:bg-surface focus:ring-1 focus:ring-deep [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue("")}
          className="absolute top-1/2 right-1.5 flex size-6 -translate-y-1/2 items-center justify-center rounded text-muted hover:text-deep"
          aria-label="Xoá từ khoá"
        >
          <X className="size-3.5" />
        </button>
      )}
    </form>
  );
}
