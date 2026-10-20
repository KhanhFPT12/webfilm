import { Film } from "lucide-react";
import { useState } from "react";

interface Props {
  src?: string;
  fallback?: string;
  alt: string;
  className?: string;
  eager?: boolean;
}

/**
 * Ảnh có lazy-load, fallback 2 tầng và skeleton placeholder tự nhiên:
 * src (webp) -> fallback (png/jpg) -> icon điện ảnh nhã nhặn.
 */
export function PosterImage({ src, fallback, alt, className = "", eager = false }: Props) {
  const candidates = [src, fallback].filter((u, i, arr): u is string => !!u && arr.indexOf(u) === i);
  const signature = candidates.join("|");
  const [state, setState] = useState({ signature, index: 0, loaded: false });
  const { index, loaded } = state.signature === signature ? state : { index: 0, loaded: false };
  const setLoaded = (v: boolean) => setState({ signature, index, loaded: v });
  const setIndex = (fn: (i: number) => number) => setState({ signature, index: fn(index), loaded: false });
  const current = candidates[index];

  if (!current) {
    return (
      <div className={`flex flex-col items-center justify-center gap-1.5 bg-sub/80 text-muted/60 ${className}`} role="img" aria-label={alt}>
        <Film className="size-6 text-muted/40" strokeWidth={1.5} />
        <span className="text-[11px] text-muted">Chưa có ảnh</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-sub/40 ${className}`}>
      {!loaded && <div className="skeleton absolute inset-0 size-full" />}
      <img
        key={current}
        src={current}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        referrerPolicy="no-referrer"
        onLoad={() => setLoaded(true)}
        onError={() => setIndex((i) => i + 1)}
        className={`size-full object-cover transition-opacity duration-200 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}
