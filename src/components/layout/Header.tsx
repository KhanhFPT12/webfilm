import { ChevronDown, Heart, History, Menu, Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useFavorites } from "../../hooks/useFavorites";
import { useWatchHistory } from "../../hooks/useWatchHistory";
import { GENRES } from "../../utils/catalog";
import { Logo } from "../common/Logo";
import { MobileBottomNav } from "./MobileBottomNav";
import { MobileMenu } from "./MobileMenu";
import { NAV_ITEMS, isNavActive } from "./nav";
import { SearchBox } from "./SearchBox";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const { pathname } = useLocation();
  const { favorites } = useFavorites();
  const { history } = useWatchHistory();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [genreOpen, setGenreOpen] = useState(false);
  const genreRef = useRef<HTMLDivElement>(null);

  // Cuộn trang để kích hoạt đổ bóng và viền solid
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Đóng mọi dropdown và menu khi chuyển trang
  useEffect(() => {
    setMenuOpen(false);
    setGenreOpen(false);
  }, [pathname]);

  // Click outside cho dropdown thể loại
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (genreRef.current && !genreRef.current.contains(e.target as Node)) {
        setGenreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const iconLink = (to: string, label: string, icon: ReactNode, badge?: number) => (
    <NavLink
      to={to}
      aria-label={badge ? `${label} (${badge})` : label}
      title={label}
      className={({ isActive }) =>
        `btn-icon relative size-9 rounded-md transition-all ${
          isActive
            ? "bg-sub text-white border border-line"
            : "text-muted hover:bg-sub hover:text-white"
        }`
      }
    >
      {icon}
      {!!badge && badge > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-deep px-1 text-[9px] font-bold text-white ring-2 ring-surface">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </NavLink>
  );

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-[background-color,border-color,box-shadow] duration-200 ${
        scrolled
          ? "border-b border-line bg-[#0c0c12] shadow-md"
          : "border-b border-line/70 bg-[#0c0c12]/95"
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-3 sm:gap-6">
        {/* Bên trái: Logo SONY CINEMA */}
        <Logo />

        {/* Giữa: Danh sách điều hướng Desktop */}
        <nav aria-label="Điều hướng chính" className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => {
            const active = isNavActive(item, pathname);

            if (item.hasDropdown) {
              return (
                <div key={item.to} ref={genreRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setGenreOpen((v) => !v)}
                    onMouseEnter={() => setGenreOpen(true)}
                    aria-expanded={genreOpen}
                    aria-current={active ? "page" : undefined}
                    className={`relative flex items-center gap-1 rounded-md px-3 py-2 text-sm transition-colors ${
                      active
                        ? "font-bold text-white"
                        : "font-medium text-muted hover:text-white"
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      className={`size-3.5 transition-transform duration-200 ${
                        genreOpen ? "rotate-180 text-deep" : "text-muted"
                      }`}
                    />
                    {active && (
                      <span
                        className="absolute inset-x-3 -bottom-[14px] h-[2px] bg-deep"
                        aria-hidden="true"
                      />
                    )}
                  </button>

                  {/* Dropdown Menu thể loại */}
                  {genreOpen && (
                    <div
                      onMouseLeave={() => setGenreOpen(false)}
                      className="absolute top-full left-0 z-50 mt-2.5 w-72 rounded-lg border border-line bg-surface p-3 shadow-2xl animate-rise"
                    >
                      <div className="mb-2 px-1 text-[11px] font-bold uppercase tracking-wider text-muted">
                        Thể loại nổi bật
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        {GENRES.slice(0, 12).map((g) => (
                          <Link
                            key={g.slug}
                            to={`/the-loai/${g.slug}`}
                            onClick={() => setGenreOpen(false)}
                            className="flex items-center rounded px-2.5 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-sub hover:text-white"
                          >
                            {g.name}
                          </Link>
                        ))}
                      </div>
                      <div className="mt-2.5 border-t border-line/60 pt-2 flex items-center justify-between text-xs">
                        <Link
                          to="/the-loai"
                          onClick={() => setGenreOpen(false)}
                          className="font-bold text-deep hover:text-deeper"
                        >
                          Tất cả thể loại →
                        </Link>
                        <Link
                          to="/quoc-gia"
                          onClick={() => setGenreOpen(false)}
                          className="text-muted hover:text-white"
                        >
                          Theo quốc gia
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={active ? "page" : undefined}
                className={`relative rounded-md px-3 py-2 text-sm transition-colors ${
                  active
                    ? "font-bold text-white"
                    : "font-medium text-muted hover:text-white"
                }`}
              >
                <span>{item.label}</span>
                {active && (
                  <span
                    className="absolute inset-x-3 -bottom-[14px] h-[2px] bg-deep"
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bên phải: Thanh tìm kiếm & Hành động */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {/* Tìm kiếm trên màn hình lớn */}
          <SearchBox className="hidden w-56 lg:block xl:w-72" />

          {/* Nút tìm kiếm cho di động / tablet */}
          <Link
            to="/tim-kiem"
            className="btn-icon size-9 rounded-md lg:hidden"
            aria-label="Tìm kiếm phim"
            title="Tìm kiếm phim"
          >
            <Search className="size-4" />
          </Link>

          {/* Nút Lọc phim */}
          {iconLink("/loc-phim", "Bộ lọc nâng cao", <SlidersHorizontal className="size-4" />)}

          {/* Nút Yêu thích */}
          {iconLink(
            "/yeu-thich",
            "Danh sách yêu thích",
            <Heart className="size-4" />,
            favorites.length,
          )}

          {/* Nút Lịch sử xem */}
          <span className="hidden sm:inline-flex">
            {iconLink(
              "/lich-su",
              "Lịch sử xem",
              <History className="size-4" />,
              history.length,
            )}
          </span>

          {/* Nút chuyển đổi giao diện */}
          <span className="hidden sm:inline-flex">
            <ThemeToggle />
          </span>

          {/* Nút mở Menu trên Mobile */}
          <button
            type="button"
            className="btn-icon size-9 rounded-md lg:hidden"
            aria-label="Mở menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="size-5 text-ink" />
          </button>
        </div>
      </div>

      {/* Menu dạng Drawer chuyên biệt cho di động */}
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Thanh điều hướng cố định góc dưới trên màn hình điện thoại */}
      <MobileBottomNav onOpenMenu={() => setMenuOpen(true)} />
    </header>
  );
}
