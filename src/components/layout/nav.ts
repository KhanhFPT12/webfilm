export interface NavItem {
  to: string;
  label: string;
  /** Các tiền tố đường dẫn được coi là đang active. */
  match: string[];
}

export const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Trang chủ", match: ["/"] },
  { to: "/phim-moi", label: "Phim mới", match: ["/phim-moi"] },
  { to: "/phim-le", label: "Phim lẻ", match: ["/phim-le"] },
  { to: "/phim-bo", label: "Phim bộ", match: ["/phim-bo"] },
  { to: "/the-loai", label: "Thể loại", match: ["/the-loai", "/quoc-gia", "/nam"] },
];

export function isNavActive(item: NavItem, pathname: string) {
  if (item.to === "/") return pathname === "/";
  return item.match.some((m) => pathname === m || pathname.startsWith(`${m}/`));
}
