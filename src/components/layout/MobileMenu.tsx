import {
  Film,
  Globe2,
  Heart,
  History,
  Home,
  Layers,
  Mic2,
  SlidersHorizontal,
  Sparkles,
  Tv,
  X,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useFavorites } from "../../hooks/useFavorites";
import { useWatchHistory } from "../../hooks/useWatchHistory";
import { FEATURED_GENRES, GENRES } from "../../utils/catalog";
import { Logo } from "../common/Logo";
import { isNavActive, NAV_ITEMS } from "./nav";
import { SearchBox } from "./SearchBox";
import { ThemeSwitcher } from "./ThemeToggle";

interface Props {
  open: boolean;
  onClose: () => void;
}

const NAV_ICONS: Record<string, typeof Home> = {
  "/": Home,
  "/phim-moi": Sparkles,
  "/phim-le": Film,
  "/phim-bo": Tv,
  "/phim-long-tieng": Mic2,
  "/the-loai": Layers,
};

export function MobileMenu({ open, onClose }: Props) {
  const { pathname } = useLocation();
  const { favorites } = useFavorites();
  const { history } = useWatchHistory();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const featuredGenresList = GENRES.filter((g) => FEATURED_GENRES.includes(g.slug));

  return (
    <div className="fixed inset-0 z-50 lg:hidden" id="mobile-menu">
      {/* Backdrop mờ tối */}
      <button
        type="button"
        className="absolute inset-0 bg-black/75 transition-opacity"
        aria-label="Đóng menu"
        onClick={onClose}
        tabIndex={-1}
      />

      {/* Drawer trượt từ bên phải */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu điều hướng di động"
        className="absolute inset-y-0 right-0 flex w-[min(86vw,340px)] flex-col overflow-y-auto border-l border-line bg-surface shadow-2xl"
      >
        {/* Header Drawer */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-4">
          <Logo onClick={onClose} />
          <button
            type="button"
            className="btn-icon size-9 rounded-md text-muted hover:text-ink"
            onClick={onClose}
            aria-label="Đóng menu"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Ô tìm kiếm di động */}
        <div className="p-4 border-b border-line/60">
          <SearchBox autoFocus onSubmitted={onClose} />
        </div>

        {/* Danh sách điều hướng chính */}
        <nav aria-label="Điều hướng di động" className="p-4 space-y-1">
          <div className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-muted">
            Khám phá rạp phim
          </div>
          {NAV_ITEMS.map((item) => {
            const active = isNavActive(item, pathname);
            const Icon = NAV_ICONS[item.to] ?? Film;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
                className={`flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-deep text-white"
                    : "text-muted hover:bg-sub hover:text-ink"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="size-4 shrink-0" />
                  <span>{item.label}</span>
                </span>
                {active && <span className="size-1.5 rounded-full bg-white" />}
              </Link>
            );
          })}

          <Link
            to="/loc-phim"
            onClick={onClose}
            className={`flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-semibold transition-colors ${
              pathname === "/loc-phim"
                ? "bg-deep text-white"
                : "text-muted hover:bg-sub hover:text-ink"
            }`}
          >
            <span className="flex items-center gap-3">
              <SlidersHorizontal className="size-4 shrink-0" />
              <span>Bộ lọc phim</span>
            </span>
          </Link>
        </nav>

        {/* Thể loại nổi bật dạng chips */}
        <div className="px-4 py-2 border-t border-line/60">
          <div className="mb-2.5 px-2 text-[10px] font-bold uppercase tracking-wider text-muted">
            Thể loại được yêu thích
          </div>
          <div className="flex flex-wrap gap-1.5 px-1">
            {featuredGenresList.map((g) => (
              <Link
                key={g.slug}
                to={`/the-loai/${g.slug}`}
                onClick={onClose}
                className="rounded border border-line bg-sub px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:border-deep/50 hover:text-white"
              >
                {g.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Mục cá nhân: Yêu thích & Lịch sử */}
        <div className="p-4 border-t border-line/60 space-y-1">
          <div className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-muted">
            Không gian cá nhân
          </div>
          <Link
            to="/yeu-thich"
            onClick={onClose}
            className={`flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              pathname === "/yeu-thich"
                ? "bg-deep text-white"
                : "text-muted hover:bg-sub hover:text-ink"
            }`}
          >
            <span className="flex items-center gap-3">
              <Heart className="size-4 text-deep" />
              <span>Góc yêu thích</span>
            </span>
            {favorites.length > 0 && (
              <span className="rounded bg-sub px-2 py-0.5 text-xs font-bold text-ink border border-line">
                {favorites.length}
              </span>
            )}
          </Link>

          <Link
            to="/lich-su"
            onClick={onClose}
            className={`flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              pathname === "/lich-su"
                ? "bg-deep text-white"
                : "text-muted hover:bg-sub hover:text-ink"
            }`}
          >
            <span className="flex items-center gap-3">
              <History className="size-4 text-muted" />
              <span>Lịch sử xem</span>
            </span>
            {history.length > 0 && (
              <span className="rounded bg-sub px-2 py-0.5 text-xs font-bold text-ink border border-line">
                {history.length}
              </span>
            )}
          </Link>

          <Link
            to="/quoc-gia"
            onClick={onClose}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted hover:bg-sub hover:text-ink"
          >
            <Globe2 className="size-4" />
            <span>Phim theo quốc gia</span>
          </Link>
        </div>

        {/* Chuyển đổi giao diện & Footer */}
        <div className="mt-auto border-t border-line p-4 space-y-3 bg-sub/40">
          <div>
            <div className="mb-1.5 px-1 text-[10px] font-bold uppercase tracking-wider text-muted">
              Giao diện hiển thị
            </div>
            <ThemeSwitcher />
          </div>
          <p className="text-[11px] text-muted text-center pt-1">
            SONY CINEMA · Trải nghiệm xem phim điện ảnh
          </p>
        </div>
      </div>
    </div>
  );
}
