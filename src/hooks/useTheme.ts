import { useCallback, useEffect, useSyncExternalStore } from "react";

export type ThemePref = "light" | "dark" | "system";
export type Theme = "light" | "dark";

const KEY = "sony.theme";
const media = typeof window !== "undefined" ? window.matchMedia("(prefers-color-scheme: dark)") : null;
const listeners = new Set<() => void>();

function readPref(): ThemePref {
  try {
    const v = localStorage.getItem(KEY);
    return v === "light" || v === "dark" ? v : "system";
  } catch {
    return "system";
  }
}

let pref: ThemePref = readPref();

function resolve(p: ThemePref): Theme {
  if (p === "system") return media?.matches ? "dark" : "light";
  return p;
}

/** Gắn data-theme lên <html> và cập nhật màu thanh trình duyệt trên điện thoại. */
function apply() {
  const theme = resolve(pref);
  const root = document.documentElement;
  if (pref === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", pref);
  root.style.colorScheme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#160a12" : "#F472B6");
  listeners.forEach((l) => l());
}

media?.addEventListener("change", () => pref === "system" && apply());
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) {
      pref = readPref();
      apply();
    }
  });
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useTheme() {
  const current = useSyncExternalStore(
    subscribe,
    () => `${pref}|${resolve(pref)}`,
    () => "system|light",
  );
  const [preference, theme] = current.split("|") as [ThemePref, Theme];

  useEffect(() => {
    apply();
  }, []);

  const setPreference = useCallback((next: ThemePref) => {
    pref = next;
    try {
      if (next === "system") localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, next);
    } catch {
      /* chế độ riêng tư: vẫn đổi được trong phiên hiện tại */
    }
    apply();
  }, []);

  const toggle = useCallback(() => setPreference(resolve(pref) === "dark" ? "light" : "dark"), [setPreference]);

  return { preference, theme, setPreference, toggle };
}
