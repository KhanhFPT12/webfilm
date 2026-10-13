import { Heart } from "lucide-react";
import type { MouseEvent } from "react";
import { useFavorites } from "../../hooks/useFavorites";
import type { Movie } from "../../types/movie";
import { useToast } from "../common/Toast";

interface Props {
  movie: Movie;
  variant?: "overlay" | "button";
  className?: string;
}

export function FavoriteButton({ movie, variant = "overlay", className = "" }: Props) {
  const { isFavorite, toggle } = useFavorites();
  const toast = useToast();
  const active = isFavorite(movie.slug);

  const onClick = (e: MouseEvent) => {
    // Không để click trái tim kích hoạt link của card.
    e.preventDefault();
    e.stopPropagation();
    const added = toggle(movie);
    toast.show(added ? "Đã thêm vào Góc phim của Sony 💗" : "Đã bỏ khỏi danh sách yêu thích");
  };

  const label = active ? `Bỏ yêu thích ${movie.name}` : `Thêm ${movie.name} vào yêu thích`;

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={`${active ? "btn-secondary border-rose bg-pastel" : "btn-secondary"} ${className}`}
      >
        <Heart className={`size-4 ${active ? "fill-deep" : ""}`} />
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
      className={`flex size-9 items-center justify-center rounded-full bg-white/95 shadow-sm ring-1 ring-black/5 transition-[transform,color] hover:scale-105 active:scale-95 ${
        active ? "text-deep" : "text-muted hover:text-deep"
      } ${className}`}
    >
      <Heart className={`size-[18px] ${active ? "fill-deep" : ""}`} strokeWidth={2.2} />
    </button>
  );
}
