import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme, type ThemePref } from "../../hooks/useTheme";

/** Nút đổi giao diện Sáng ↔ Tối */
export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      className="btn-icon relative size-9 rounded-lg overflow-hidden"
      aria-label={dark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
      title={dark ? "Chế độ sáng" : "Chế độ tối"}
    >
      <Sun
        className={`absolute size-4.5 transition-all duration-200 ${
          dark ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"
        }`}
      />
      <Moon
        className={`absolute size-4.5 transition-all duration-200 ${
          dark ? "translate-y-0 opacity-100 text-deep" : "-translate-y-4 opacity-0"
        }`}
      />
    </button>
  );
}

const OPTIONS: { value: ThemePref; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Sáng", icon: Sun },
  { value: "dark", label: "Tối", icon: Moon },
  { value: "system", label: "Tự động", icon: Monitor },
];

/** Bộ chọn giao diện 3 lựa chọn cho menu mobile */
export function ThemeSwitcher() {
  const { preference, setPreference } = useTheme();
  return (
    <div role="radiogroup" aria-label="Giao diện" className="grid grid-cols-3 gap-1 rounded-lg border border-line bg-sub p-1">
      {OPTIONS.map(({ value, label, icon: Icon }) => {
        const active = preference === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setPreference(value)}
            className={`flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-semibold transition-colors ${
              active ? "bg-surface text-deep shadow-xs" : "text-muted hover:text-ink"
            }`}
          >
            <Icon className="size-3.5" /> {label}
          </button>
        );
      })}
    </div>
  );
}
