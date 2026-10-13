import { useCallback, useSyncExternalStore } from "react";
import { createStore } from "../utils/storage";

export interface HistoryEntry {
  slug: string;
  name: string;
  originalName?: string;
  poster?: string;
  posterFallback?: string;
  episodeSlug?: string;
  episodeName?: string;
  serverIndex?: number;
  totalEpisodes?: number;
  watchedAt: number;
}

/** Giới hạn để LocalStorage không phình to. */
export const MAX_HISTORY = 50;

function validate(value: unknown): HistoryEntry[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (v): v is HistoryEntry =>
        !!v && typeof v === "object" && typeof v.slug === "string" && typeof v.name === "string" && typeof v.watchedAt === "number",
    )
    .slice(0, MAX_HISTORY);
}

const store = createStore<HistoryEntry[]>("sony.history.v1", [], validate);

export function useWatchHistory() {
  const history = useSyncExternalStore(store.subscribe, store.get, store.get);

  const record = useCallback((entry: Omit<HistoryEntry, "watchedAt">) => {
    store.set((prev) => {
      const current = prev.find((h) => h.slug === entry.slug);
      // Tránh ghi liên tục khi cùng tập trong vòng 30 giây.
      if (
        current &&
        current.episodeSlug === entry.episodeSlug &&
        current.serverIndex === entry.serverIndex &&
        Date.now() - current.watchedAt < 30_000 &&
        prev[0]?.slug === entry.slug
      ) {
        return prev;
      }
      return [{ ...entry, watchedAt: Date.now() }, ...prev.filter((h) => h.slug !== entry.slug)].slice(0, MAX_HISTORY);
    });
  }, []);

  const get = useCallback((slug: string) => history.find((h) => h.slug === slug), [history]);
  const remove = useCallback((slug: string) => store.set((prev) => prev.filter((h) => h.slug !== slug)), []);
  const clear = useCallback(() => store.set(() => []), []);

  return { history, record, get, remove, clear };
}
