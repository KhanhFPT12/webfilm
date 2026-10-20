import { Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { EpisodeServer } from "../../types/movie";
import { episodeLabel } from "../../utils/formatters";

interface Props {
  slug: string;
  servers: EpisodeServer[];
  serverIndex: number;
  onServerChange: (index: number) => void;
  activeEpisode?: string;
  tone?: "light" | "dark";
}

export const watchUrl = (slug: string, episode: string, server: number) =>
  `/xem-phim/${slug}?tap=${encodeURIComponent(episode)}${server > 0 ? `&sv=${server}` : ""}`;

export function EpisodeList({ slug, servers, serverIndex, onServerChange, activeEpisode, tone = "light" }: Props) {
  const dark = tone === "dark";
  const server = servers[serverIndex] ?? servers[0];
  const [query, setQuery] = useState("");
  const activeRef = useRef<HTMLAnchorElement>(null);

  const episodes = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!server) return [];
    if (!q) return server.episodes;
    return server.episodes.filter((e) => e.name.toLowerCase().includes(q) || episodeLabel(e.name).toLowerCase().includes(q));
  }, [server, query]);

  // Cuộn tập đang xem vào giữa danh sách (chỉ trong khung danh sách).
  useEffect(() => {
    const el = activeRef.current;
    const box = el?.parentElement;
    if (el && box && box.scrollHeight > box.clientHeight) {
      const offset = el.getBoundingClientRect().top - box.getBoundingClientRect().top + box.scrollTop;
      box.scrollTop = offset - box.clientHeight / 2 + el.clientHeight / 2;
    }
  }, [activeEpisode, serverIndex]);

  if (!server) return null;

  return (
    <div>
      {servers.length > 1 && (
        <div role="tablist" aria-label="Chọn server" className="mb-3.5 flex flex-wrap gap-2">
          {servers.map((s, i) => (
            <button
              key={`${s.name}-${i}`}
              role="tab"
              type="button"
              aria-selected={i === serverIndex}
              onClick={() => onServerChange(i)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                i === serverIndex
                  ? "border-deep bg-deep text-white"
                  : dark
                    ? "border-plum-700 text-plum-300 hover:border-rose hover:text-white"
                    : "border-line bg-surface text-ink hover:border-deep/40 hover:text-deep"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      )}

      {server.episodes.length > 24 && (
        <label className="relative mb-3 block max-w-xs">
          <span className="sr-only">Tìm số tập</span>
          <Search
            className={`pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 ${
              dark ? "text-plum-300" : "text-muted"
            }`}
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            inputMode="numeric"
            placeholder="Tìm số tập…"
            className={
              dark
                ? "h-9 w-full rounded-lg border border-plum-700 bg-plum-900 pr-3 pl-8 text-xs text-white placeholder:text-plum-300/80 outline-none focus:border-rose"
                : "h-9 w-full rounded-lg border border-line bg-surface pr-3 pl-8 text-xs text-ink placeholder:text-muted outline-none focus:border-deep"
            }
          />
        </label>
      )}

      {episodes.length === 0 ? (
        <p className={`py-4 text-xs ${dark ? "text-plum-300" : "text-muted"}`}>
          Không có tập nào khớp “{query}”.
        </p>
      ) : (
        <div className="scrollbar-pink grid max-h-[340px] grid-cols-[repeat(auto-fill,minmax(72px,1fr))] gap-2 overflow-y-auto pr-1">
          {episodes.map((ep) => {
            const active = ep.slug === activeEpisode;
            return (
              <Link
                key={ep.slug}
                ref={active ? activeRef : undefined}
                to={watchUrl(slug, ep.slug, serverIndex)}
                aria-current={active ? "true" : undefined}
                title={episodeLabel(ep.name)}
                className={`flex h-9 items-center justify-center truncate rounded-lg border px-2 text-xs font-semibold transition-colors ${
                  active
                    ? "border-deep bg-deep text-white"
                    : dark
                      ? "border-plum-700 bg-plum-900 text-plum-300 hover:border-rose hover:text-white"
                      : "border-line bg-surface text-ink hover:border-deep/40 hover:bg-sub hover:text-deep"
                }`}
              >
                {episodeLabel(ep.name)}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
