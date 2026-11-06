import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme, type ThemePref } from "../../hooks/useTheme";

/** Nút đổi giao diện Tối ↔ Sáng */
export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      className="btn-icon relative size-9 rounded-md"
      aria-label={dark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
      title={dark ? "Giao diện sáng" : "Giao diện tối"}
    >
      <Sun
        className={`size-4 transition-all duration-200 ${
          dark ? "rotate-90 scale-0 opacity-0 absolute" : "rotate-0 scale-100 opacity-100 text-amber-500"
        }`}
      />
      <Moon
        className={`size-4 transition-all duration-200 ${
          dark ? "rotate-0 scale-100 opacity-100 text-deep" : "-rotate-90 scale-0 opacity-0 absolute"
        }`}
      />
    </button>
  );
}

const OPTIONS: { value: ThemePref; label: string; icon: typeof Sun }[] = [
  { value: "dark", label: "Tối", icon: Moon },
  { value: "light", label: "Sáng", icon: Sun },
  { value: "system", label: "Hệ thống", icon: Monitor },
];

/** Bộ chọn giao diện cho menu di động */
export function ThemeSwitcher() {
  const { preference, setPreference } = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Chế độ giao diện"
      className="grid grid-cols-3 gap-1 rounded-md border border-line bg-sub p-1"
    >
      {OPTIONS.map(({ value, label, icon: Icon }) => {
        const active = preference === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setPreference(value)}
            className={`flex items-center justify-center gap-1.5 rounded py-1.5 text-xs font-semibold transition-colors ${
              active
                ? "bg-surface text-deep border border-line shadow-xs"
                : "text-muted hover:text-ink"
            }`}
          >
            <Icon className="size-3.5" /> {label}
          </button>
        );
      })}
    </div>
  );
}
