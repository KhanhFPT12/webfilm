import { Heart, History, Menu, Search } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useFavorites } from "../../hooks/useFavorites";
import { Logo } from "../common/Logo";
import { MobileMenu } from "./MobileMenu";
import { NAV_ITEMS, isNavActive } from "./nav";
import { SearchBox } from "./SearchBox";

export function Header() {
  const { pathname } = useLocation();
  const { favorites } = useFavorites();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
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
      className={({ isActive }) => `btn-icon relative ${isActive ? "bg-pastel text-deep" : ""}`}
    >
      {icon}
      {!!badge && (
        <span className="absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-deep px-1 text-[10px] font-bold text-white ring-2 ring-white">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </NavLink>
  );

  return (
    <header
      className={`sticky top-0 z-40 border-b border-line bg-white/95 transition-shadow duration-300 ${scrolled ? "shadow-[0_6px_20px_-12px_rgb(219_39_119/0.45)]" : ""}`}
    >
      <div className="container-page flex h-16 items-center gap-4 lg:h-[72px]">
        <Logo />

        <nav aria-label="Điều hướng chính" className="mx-auto hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => {
            const active = isNavActive(item, pathname);
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={active ? "page" : undefined}
                className={`relative rounded-lg px-3.5 py-2 text-[15px] font-semibold transition-colors ${
                  active ? "text-deep" : "text-ink hover:bg-pastel hover:text-deep"
                }`}
              >
                {item.label}
                {active && <span className="absolute inset-x-3.5 -bottom-[15px] h-[3px] rounded-t-full bg-deep" aria-hidden="true" />}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          <SearchBox className="mr-1 hidden w-60 md:block lg:hidden xl:block xl:w-64" />
          <Link to="/tim-kiem" className="btn-icon md:hidden lg:inline-flex xl:hidden" aria-label="Tìm kiếm">
            <Search className="size-5" />
          </Link>
          {iconLink("/yeu-thich", "Danh sách yêu thích", <Heart className="size-5" />, favorites.length)}
          <span className="hidden sm:contents">{iconLink("/lich-su", "Lịch sử xem", <History className="size-5" />)}</span>
          <button
            type="button"
            className="btn-icon lg:hidden"
            aria-label="Mở menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="size-6" />
          </button>
        </div>
      </div>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
