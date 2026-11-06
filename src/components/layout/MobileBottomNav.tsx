import { Film, Heart, Home, Menu, Tv } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useFavorites } from "../../hooks/useFavorites";

interface Props {
  onOpenMenu: () => void;
}

export function MobileBottomNav({ onOpenMenu }: Props) {
  const { pathname } = useLocation();
  const { favorites } = useFavorites();

  const tabs = [
    { to: "/", label: "Trang chủ", icon: Home, active: pathname === "/" },
    { to: "/phim-le", label: "Phim lẻ", icon: Film, active: pathname.startsWith("/phim-le") },
    { to: "/phim-bo", label: "Phim bộ", icon: Tv, active: pathname.startsWith("/phim-bo") },
    {
      to: "/yeu-thich",
      label: "Yêu thích",
      icon: Heart,
      active: pathname.startsWith("/yeu-thich"),
      badge: favorites.length,
    },
  ];

  return (
    <nav
      aria-label="Điều hướng nhanh di động"
      className="fixed inset-x-0 bottom-0 z-40 block lg:hidden border-t border-line bg-[#0c0c12]/98 backdrop-blur-xs pb-[env(safe-area-inset-bottom,0px)]"
    >
      <div className="grid grid-cols-5 h-14 items-center px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={`relative flex flex-col items-center justify-center py-1 transition-colors ${
                tab.active ? "text-deep font-bold" : "text-muted hover:text-ink"
              }`}
            >
              <div className="relative">
                <Icon className="size-5" />
                {!!tab.badge && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-deep px-1 text-[9px] font-black text-white">
                    {tab.badge > 99 ? "99+" : tab.badge}
                  </span>
                )}
              </div>
              <span className="mt-1 text-[10px] leading-none tracking-tight">{tab.label}</span>
            </Link>
          );
        })}

        <button
          type="button"
          onClick={onOpenMenu}
          className="flex flex-col items-center justify-center py-1 text-muted transition-colors hover:text-ink"
        >
          <Menu className="size-5" />
          <span className="mt-1 text-[10px] leading-none tracking-tight">Thêm</span>
        </button>
      </div>
    </nav>
  );
}

