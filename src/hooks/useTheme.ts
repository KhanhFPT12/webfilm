import { useCallback, useEffect, useSyncExternalStore } from "react";

export type ThemePref = "light" | "dark" | "system";
export type Theme = "light" | "dark";

const KEY = "sony.theme";
const listeners = new Set<() => void>();

function readPref(): ThemePref {
  try {
    const v = localStorage.getItem(KEY);
    return v === "light" || v === "dark" ? v : "dark";
  } catch {
    return "dark";
  }
}

let pref: ThemePref = readPref();

function resolve(p: ThemePref): Theme {
  if (p === "light") return "light";
  return "dark";
}

/** Gắn data-theme lên <html> và cập nhật màu thanh trình duyệt */
function apply() {
  const theme = resolve(pref);
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.style.colorScheme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", theme === "dark" ? "#0C0C12" : "#F8F7FA");
  listeners.forEach((l) => l());
}

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
    () => "dark|dark",
  );
  const [preference, theme] = current.split("|") as [ThemePref, Theme];

  useEffect(() => {
    apply();
  }, []);

  const setPreference = useCallback((next: ThemePref) => {
    pref = next;
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* Chế độ riêng tư */
    }
    apply();
  }, []);

  const toggle = useCallback(
    () => setPreference(resolve(pref) === "dark" ? "light" : "dark"),
    [setPreference],
  );

  return { preference, theme, setPreference, toggle };
}
