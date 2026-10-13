import { useCallback, useSyncExternalStore } from "react";
import type { Movie } from "../types/movie";
import { createStore } from "../utils/storage";

export interface FavoriteMovie {
  slug: string;
  name: string;
  originalName?: string;
  year?: string;
  poster?: string;
  posterFallback?: string;
  currentEpisode?: string;
  quality?: string;
  addedAt: number;
}

const MAX_FAVORITES = 300;

function validate(value: unknown): FavoriteMovie[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is FavoriteMovie => !!v && typeof v === "object" && typeof v.slug === "string" && typeof v.name === "string");
}

const store = createStore<FavoriteMovie[]>("sony.favorites.v1", [], validate);

export function toFavorite(m: Movie): FavoriteMovie {
  return {
    slug: m.slug,
    name: m.name,
    originalName: m.originalName,
    year: m.year,
    poster: m.poster,
    posterFallback: m.posterFallback,
    currentEpisode: m.currentEpisode,
    quality: m.quality,
    addedAt: Date.now(),
  };
}

/** Chuyển mục yêu thích lại thành Movie để dùng chung MovieCard. */
export function favoriteToMovie(f: FavoriteMovie): Movie {
  return {
    slug: f.slug,
    name: f.name,
    originalName: f.originalName,
    year: f.year,
    poster: f.poster,
    posterFallback: f.posterFallback,
    currentEpisode: f.currentEpisode,
    quality: f.quality,
  };
}

export function useFavorites() {
  const favorites = useSyncExternalStore(store.subscribe, store.get, store.get);

  const isFavorite = useCallback((slug: string) => favorites.some((f) => f.slug === slug), [favorites]);

  const toggle = useCallback((movie: Movie) => {
    let added = false;
    store.set((prev) => {
      if (prev.some((f) => f.slug === movie.slug)) return prev.filter((f) => f.slug !== movie.slug);
      added = true;
      return [toFavorite(movie), ...prev].slice(0, MAX_FAVORITES);
    });
    return added;
  }, []);

  const remove = useCallback((slug: string) => store.set((prev) => prev.filter((f) => f.slug !== slug)), []);
  const clear = useCallback(() => store.set(() => []), []);

  return { favorites, isFavorite, toggle, remove, clear };
}
