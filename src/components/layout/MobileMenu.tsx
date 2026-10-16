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
      // Giữ focus trong menu
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
    <div className="fixed inset-0 z-50 lg:hidden" id="mobile-menu">
      <button type="button" className="absolute inset-0 bg-black/50" aria-label="Đóng menu" onClick={onClose} tabIndex={-1} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className="absolute inset-y-0 right-0 flex w-[min(86vw,360px)] flex-col overflow-y-auto bg-surface shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <Logo onClick={onClose} />
          <button type="button" className="btn-icon" onClick={onClose} aria-label="Đóng menu">
            <X className="size-6" />
          </button>
        </div>

        <div className="px-4 pt-4">
          <SearchBox autoFocus onSubmitted={onClose} />
        </div>

        <nav aria-label="Điều hướng di động" className="px-2 pt-3">
          {NAV_ITEMS.map((item) => {
            const active = isNavActive(item, pathname);
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={active ? "page" : undefined}
                className={`flex items-center rounded-lg px-3 py-3 text-base font-semibold ${
                  active ? "bg-pastel text-deep" : "text-ink hover:bg-blush"
                }`}
              >
                {active && <span className="mr-2.5 h-4 w-1 rounded-full bg-deep" aria-hidden="true" />}
                {item.label}
              </Link>
            );
          })}
          <Link to="/quoc-gia" className="flex items-center gap-2 rounded-lg px-3 py-3 text-base font-semibold text-ink hover:bg-blush">
            <Globe2 className="size-4 text-muted" /> Quốc gia
          </Link>
        </nav>

        <div className="mx-4 my-3 border-t border-line" />

        <div className="px-2">
          <Link to="/yeu-thich" className="flex items-center gap-2 rounded-lg px-3 py-3 font-semibold text-ink hover:bg-blush">
            <Heart className="size-4 text-deep" /> Góc phim yêu thích
          </Link>
          <Link to="/lich-su" className="flex items-center gap-2 rounded-lg px-3 py-3 font-semibold text-ink hover:bg-blush">
            <History className="size-4 text-deep" /> Lịch sử xem
          </Link>
        </div>

        <div className="px-4 pt-3">
          <p className="mb-2 text-xs font-semibold tracking-wider text-muted uppercase">Giao diện</p>
          <ThemeSwitcher />
        </div>

        <div className="px-4 pt-5 pb-6">
          <p className="mb-2 text-xs font-semibold tracking-wider text-muted uppercase">Thể loại nổi bật</p>
          <div className="flex flex-wrap gap-2">
            {genres.map((g) => (
              <Link key={g.slug} to={`/the-loai/${g.slug}`} className="chip text-[13px]">
                {g.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
