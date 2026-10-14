import { Heart } from "lucide-react";
import { useState, type MouseEvent } from "react";
import { useFavorites } from "../../hooks/useFavorites";
import type { Movie } from "../../types/movie";
import { useToast } from "../common/Toast";

interface Props {
  movie: Movie;
  variant?: "overlay" | "button";
  className?: string;
}

/** 6 trái tim nhỏ bung ra khi thêm vào yêu thích. */
function HeartBurst() {
  return (
    <span className="pointer-events-none absolute top-1/2 left-1/2" aria-hidden="true">
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <svg
          key={a}
          viewBox="0 0 24 24"
          className="absolute top-0 left-0 size-2.5 text-accent"
          style={{ ["--a" as string]: `${a}deg`, animation: "burst 0.6s var(--ease-soft) forwards" }}
        >
          <path d="M12 21s-8-4.9-8-11a4.6 4.6 0 0 1 8-3 4.6 4.6 0 0 1 8 3c0 6.1-8 11-8 11z" fill="currentColor" />
        </svg>
      ))}
    </span>
  );
}

export function FavoriteButton({ movie, variant = "overlay", className = "" }: Props) {
  const { isFavorite, toggle } = useFavorites();
  const toast = useToast();
  const active = isFavorite(movie.slug);
  // Mỗi lần bấm tăng key để chạy lại animation.
  const [pulse, setPulse] = useState({ n: 0, added: false });

  const onClick = (e: MouseEvent) => {
    // Không để click trái tim kích hoạt link của card.
    e.preventDefault();
    e.stopPropagation();
    const added = toggle(movie);
    setPulse((p) => ({ n: p.n + 1, added }));
    toast.show(added ? "Đã thêm vào Góc phim của Sony 💗" : "Đã bỏ khỏi danh sách yêu thích");
  };

  const label = active ? `Bỏ yêu thích ${movie.name}` : `Thêm ${movie.name} vào yêu thích`;
  const heart = (
    <span key={pulse.n} className={`relative inline-flex ${pulse.n ? "animate-pop" : ""}`}>
      <Heart
        className={`${variant === "button" ? "size-4" : "size-[18px]"} transition-colors ${active ? "fill-deep text-deep" : ""}`}
        strokeWidth={2.2}
      />
      {pulse.n > 0 && pulse.added && <HeartBurst />}
    </span>
  );

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={`${active ? "btn-secondary border-rose bg-pastel" : "btn-secondary"} ${className}`}
      >
        {heart}
        {active ? "Đã yêu thích" : "Thêm vào yêu thích"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      title={active ? "Bỏ yêu thích" : "Yêu thích"}
      className={`flex size-9 items-center justify-center rounded-full bg-white/95 shadow-md ring-1 ring-black/5 transition-[transform,color] duration-200 hover:scale-110 active:scale-90 ${
        active ? "text-deep" : "text-muted hover:text-deep"
      } ${className}`}
    >
      {heart}
    </button>
  );
}
