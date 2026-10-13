/**
 * Kho dữ liệu nhỏ đồng bộ với LocalStorage.
 * - An toàn khi LocalStorage bị chặn (chế độ riêng tư) hoặc dữ liệu hỏng.
 * - Đồng bộ giữa các component (useSyncExternalStore) và giữa các tab (sự kiện storage).
 */

export function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export interface Store<T> {
  get: () => T;
  set: (updater: (prev: T) => T) => void;
  subscribe: (listener: () => void) => () => void;
}

export function createStore<T>(key: string, fallback: T, validate: (v: unknown) => T): Store<T> {
  let state: T = validate(readJson<unknown>(key, fallback));
  const listeners = new Set<() => void>();
  const emit = () => listeners.forEach((l) => l());

  if (typeof window !== "undefined") {
    window.addEventListener("storage", (e) => {
      if (e.key !== key) return;
      state = validate(readJson<unknown>(key, fallback));
      emit();
    });
  }

  return {
    get: () => state,
    set(updater) {
      state = updater(state);
      writeJson(key, state);
      emit();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
