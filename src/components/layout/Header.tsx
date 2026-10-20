import { Heart, History, Menu, Search } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useFavorites } from "../../hooks/useFavorites";
import { Logo } from "../common/Logo";
import { MobileMenu } from "./MobileMenu";
import { NAV_ITEMS, isNavActive } from "./nav";
import { SearchBox } from "./SearchBox";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const { pathname } = useLocation();
  const { favorites } = useFavorites();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  const iconLink = (to: string, label: string, icon: ReactNode, badge?: number) => (
    <NavLink
      to={to}
      aria-label={badge ? `${label} (${badge})` : label}
      title={label}
      className={({ isActive }) =>
        `btn-icon relative size-9 shrink-0 rounded-lg ${
          isActive ? "bg-pastel/60 text-deep" : "text-ink/80 hover:bg-sub hover:text-deep"
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
      className={`sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur-sm transition-shadow duration-200 ${
        scrolled ? "shadow-xs" : ""
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-2 sm:gap-4 lg:gap-6">
        <Logo />

        {/* Desktop Navigation */}
        <nav aria-label="Điều hướng chính" className="mx-auto hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => {
            const active = isNavActive(item, pathname);
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={active ? "page" : undefined}
                className={`relative px-3 py-1.5 text-[14px] transition-colors ${
                  active
                    ? "font-semibold text-deep"
                    : "font-medium text-ink/80 hover:text-deep"
                }`}
              >
                <span>{item.label}</span>
                {active && (
                  <span
                    className="absolute inset-x-3 -bottom-4.5 h-[2px] rounded-full bg-deep"
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Actions Toolbar */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
          <SearchBox className="hidden w-56 lg:block xl:w-64" />
          <Link
            to="/tim-kiem"
            className="btn-icon size-9 lg:hidden"
            aria-label="Tìm kiếm phim"
          >
            <Search className="size-4.5" />
          </Link>

          {iconLink("/yeu-thich", "Danh sách yêu thích", <Heart className="size-4.5" />, favorites.length)}

          <span className="hidden sm:inline-flex">
            {iconLink("/lich-su", "Lịch sử xem", <History className="size-4.5" />)}
          </span>

          <span className="hidden sm:inline-flex">
            <ThemeToggle />
          </span>

          <button
            type="button"
            className="btn-icon size-9 lg:hidden"
            aria-label="Mở menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="size-5" />
          </button>
        </div>
      </div>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
