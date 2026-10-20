import { Globe2, Heart, History, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { FEATURED_GENRES, GENRES } from "../../utils/catalog";
import { Logo } from "../common/Logo";
import { NAV_ITEMS, isNavActive } from "./nav";
import { SearchBox } from "./SearchBox";
import { ThemeSwitcher } from "./ThemeToggle";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: Props) {
  const { pathname } = useLocation();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panelRef.current) {
        const items = panelRef.current.querySelectorAll<HTMLElement>("a, button, input");
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const genres = GENRES.filter((g) => FEATURED_GENRES.includes(g.slug));

  return (
    <div className="fixed inset-0 z-50 md:hidden" id="mobile-menu">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        aria-label="Đóng menu"
        onClick={onClose}
        tabIndex={-1}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className="absolute inset-y-0 right-0 flex w-[min(84vw,340px)] flex-col overflow-y-auto border-l border-line bg-surface shadow-xl"
      >
        <div className="flex h-16 items-center justify-between border-b border-line px-4">
          <Logo onClick={onClose} />
          <button
            type="button"
            className="btn-icon size-8 text-muted hover:text-ink"
            onClick={onClose}
            aria-label="Đóng menu"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="p-4">
          <SearchBox autoFocus onSubmitted={onClose} />
        </div>

        <nav aria-label="Điều hướng di động" className="px-3">
          <p className="mb-2 px-3 text-[11px] font-semibold tracking-wider text-muted uppercase">
            Menu
          </p>
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = isNavActive(item, pathname);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-pastel/60 text-deep font-semibold"
                      : "text-ink hover:bg-sub"
                  }`}
                >
                  <span>{item.label}</span>
                  {active && <span className="size-1.5 rounded-full bg-deep" aria-hidden="true" />}
                </Link>
              );
            })}
            <Link
              to="/quoc-gia"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-ink hover:bg-sub"
            >
              <Globe2 className="size-4 text-muted" /> Quốc gia
            </Link>
          </div>
        </nav>

        <div className="mx-4 my-3 border-t border-line" />

        <div className="px-3">
          <p className="mb-2 px-3 text-[11px] font-semibold tracking-wider text-muted uppercase">
            Cá nhân
          </p>
          <div className="space-y-1">
            <Link
              to="/yeu-thich"
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-ink hover:bg-sub"
            >
              <Heart className="size-4 text-deep" /> Góc phim yêu thích
            </Link>
            <Link
              to="/lich-su"
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-ink hover:bg-sub"
            >
              <History className="size-4 text-deep" /> Lịch sử xem
            </Link>
          </div>
        </div>

        <div className="mx-4 my-3 border-t border-line" />

        <div className="px-4">
          <p className="mb-2 text-[11px] font-semibold tracking-wider text-muted uppercase">Giao diện</p>
          <ThemeSwitcher />
        </div>

        <div className="px-4 pt-4 pb-8">
          <p className="mb-2 text-[11px] font-semibold tracking-wider text-muted uppercase">Thể loại nổi bật</p>
          <div className="flex flex-wrap gap-1.5">
            {genres.map((g) => (
              <Link
                key={g.slug}
                to={`/the-loai/${g.slug}`}
                className="chip py-1 text-xs"
              >
                {g.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
