import { Clapperboard } from "lucide-react";
import { useState } from "react";

interface Props {
  src?: string;
  fallback?: string;
  alt: string;
  className?: string;
  eager?: boolean;
}

/**
 * Ảnh có lazy-load và fallback 2 tầng:
 * src (webp) -> fallback (png/jpg) -> khung trống có biểu tượng.
 */
export function PosterImage({ src, fallback, alt, className = "", eager = false }: Props) {
  const candidates = [src, fallback].filter((u, i, arr): u is string => !!u && arr.indexOf(u) === i);
  const signature = candidates.join("|");
  const [state, setState] = useState({ signature, index: 0, loaded: false });
  // Ảnh nguồn đổi (component được tái sử dụng cho phim khác) -> bắt đầu lại.
  const { index, loaded } = state.signature === signature ? state : { index: 0, loaded: false };
  const setLoaded = (v: boolean) => setState({ signature, index, loaded: v });
  const setIndex = (fn: (i: number) => number) => setState({ signature, index: fn(index), loaded: false });
  const current = candidates[index];

  if (!current) {
    return (
      <div className={`flex flex-col items-center justify-center gap-2 bg-pastel text-rose ${className}`} role="img" aria-label={alt}>
        <Clapperboard className="size-8" strokeWidth={1.5} />
        <span className="px-3 text-center text-xs font-medium text-muted">Chưa có ảnh</span>
      </div>
    );
  }

  return (
    <img
      key={current}
      src={current}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      referrerPolicy="no-referrer"
      onLoad={() => setLoaded(true)}
      onError={() => setIndex((i) => i + 1)}
      className={`bg-pastel object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
    />
  );
}
