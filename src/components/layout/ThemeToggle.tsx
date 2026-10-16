import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme, type ThemePref } from "../../hooks/useTheme";

/** Nút tròn đổi sáng ↔ tối: mặt trời xoay đi, mặt trăng xoay vào. */
export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      className="btn-icon relative overflow-hidden"
      aria-label={dark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
      title={dark ? "Chế độ sáng" : "Chế độ tối"}
    >
      <Sun
        className={`absolute size-5 transition-all duration-500 [transition-timing-function:var(--ease-bounce)] ${
          dark ? "translate-y-6 rotate-90 opacity-0" : "translate-y-0 rotate-0 opacity-100"
        }`}
      />
      <Moon
        className={`absolute size-5 transition-all duration-500 [transition-timing-function:var(--ease-bounce)] ${
          dark ? "translate-y-0 rotate-0 fill-rose/30 text-rose opacity-100" : "-translate-y-6 -rotate-90 opacity-0"
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

/** Bộ chọn 3 lựa chọn (dùng trong menu mobile). */
export function ThemeSwitcher() {
  const { preference, setPreference } = useTheme();
  return (
    <div role="radiogroup" aria-label="Giao diện" className="grid grid-cols-3 gap-1 rounded-xl bg-pastel p-1 ring-1 ring-line">
      {OPTIONS.map(({ value, label, icon: Icon }) => {
        const active = preference === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setPreference(value)}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold transition-all duration-300 ${
              active ? "bg-surface text-deep shadow-sm" : "text-muted hover:text-ink"
            }`}
          >
            <Icon className="size-4" /> {label}
          </button>
        );
      })}
    </div>
  );
}
