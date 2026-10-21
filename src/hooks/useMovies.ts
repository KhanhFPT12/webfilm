import { useCallback, useEffect, useRef, useState } from "react";
import {
  getCountryView,
  getGenreMovies,
  getGenreView,
  getLanguageMovies,
  getLanguageView,
  getLatestMovies,
  getLatestView,
  getListMovies,
  getListView,
  getMovieDetail,
  getYearView,
  searchMovies,
} from "../api/movies";
import type { ListType } from "../utils/catalog";

export interface QueryState<T> {
  data: T | undefined;
  error: unknown;
  loading: boolean;
  reload: () => void;
}

/** Kết quả đã tải theo key — giúp quay lại trang hiển thị ngay, không nháy skeleton. */
const resolved = new Map<string, unknown>();
const RESOLVED_MAX = 150;

function keep(key: string, data: unknown) {
  resolved.delete(key);
  resolved.set(key, data);
  if (resolved.size > RESOLVED_MAX) {
    const oldest = resolved.keys().next().value;
    if (oldest !== undefined) resolved.delete(oldest);
  }
}

/**
 * Hook tải dữ liệu tối giản: theo `key`, bỏ qua kết quả cũ khi key đổi,
 * có `reload()` bỏ qua cache. Request trùng đã được gộp ở tầng api/client.
 * Truyền key = null để tạm không tải.
 */
export function useQuery<T>(key: string | null, fetcher: () => Promise<T>): QueryState<T> {
  const [state, setState] = useState<{ key: string | null; data?: T; error?: unknown; loading: boolean }>(() => ({
    key,
    data: key ? (resolved.get(key) as T | undefined) : undefined,
    loading: key ? !resolved.has(key) : false,
  }));
  const [nonce, setNonce] = useState(0);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    if (!key) {
      setState({ key, loading: false });
      return;
    }
    let active = true;
    const cached = nonce === 0 ? (resolved.get(key) as T | undefined) : undefined;
    setState({ key, data: cached, loading: cached === undefined });

    fetcherRef
      .current()
      .then((data) => {
        keep(key, data);
        if (active) setState({ key, data, loading: false });
      })
      .catch((error) => {
        if (active) setState({ key, error, loading: false });
      });

    return () => {
      active = false;
    };
  }, [key, nonce]);

  const reload = useCallback(() => {
    if (key) resolved.delete(key);
    setNonce((n) => n + 1);
  }, [key]);

  // Khi key vừa đổi, state cũ chưa kịp cập nhật -> coi như đang tải.
  const stale = state.key !== key;
  return {
    data: stale ? (key ? (resolved.get(key) as T | undefined) : undefined) : state.data,
    error: stale ? undefined : state.error,
    loading: stale ? !!key && !resolved.has(key) : state.loading,
    reload,
  };
}

/* ------------------------------ Hook cụ thể ------------------------------ */

export const useLatestMovies = (apiPage = 1) => useQuery(`latest:${apiPage}`, () => getLatestMovies(apiPage));
export const useListMovies = (type: ListType, apiPage = 1) => useQuery(`list:${type}:${apiPage}`, () => getListMovies(type, apiPage));
export const useGenreMovies = (slug: string | undefined, apiPage = 1) =>
  useQuery(slug ? `genre:${slug}:${apiPage}` : null, () => getGenreMovies(slug!, apiPage));
export const useLanguageMovies = (slug = "long-tieng", apiPage = 1) =>
  useQuery(`language:${slug}:${apiPage}`, () => getLanguageMovies(slug, apiPage));
export const useMovieDetail = (slug: string | undefined) => useQuery(slug ? `detail:${slug}` : null, () => getMovieDetail(slug!));

export type CatalogSource =
  | { kind: "latest" }
  | { kind: "list"; type: ListType }
  | { kind: "genre"; slug: string }
  | { kind: "country"; slug: string }
  | { kind: "year"; year: string }
  | { kind: "language"; slug: string };

export function useCatalog(source: CatalogSource | null, page: number) {
  const key = source ? `view:${JSON.stringify(source)}:${page}` : null;
  return useQuery(key, () => {
    switch (source!.kind) {
      case "latest":
        return getLatestView(page);
      case "list":
        return getListView(source!.type, page);
      case "genre":
        return getGenreView(source!.slug, page);
      case "country":
        return getCountryView(source!.slug, page);
      case "year":
        return getYearView(source!.year, page);
      case "language":
        return getLanguageView(source!.slug, page);
    }
  });
}

export const useSearch = (keyword: string, page: number) =>
  useQuery(keyword.trim().length >= 2 ? `search:${keyword.trim().toLowerCase()}:${page}` : null, () => searchMovies(keyword, page));
