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
    e.preventDefault();
    e.stopPropagation();
    const added = toggle(movie);
    toast.show(added ? `Đã lưu “${movie.name}” vào góc yêu thích` : `Đã bỏ “${movie.name}” khỏi yêu thích`);
  };

  const label = active ? `Bỏ yêu thích ${movie.name}` : `Thêm ${movie.name} vào yêu thích`;

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={`${
          active
            ? "btn border border-deep/40 bg-pastel/50 text-deep hover:bg-pastel"
            : "btn-secondary"
        } ${className}`}
      >
        <Heart
          className={`size-4 transition-colors ${active ? "fill-deep text-deep" : "text-muted"}`}
          strokeWidth={2}
        />
        <span>{active ? "Đã lưu vào rạp Sony" : "Thêm vào yêu thích"}</span>
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
      className={`flex size-8.5 items-center justify-center rounded-full bg-surface/90 shadow-sm backdrop-blur-xs ring-1 ring-black/5 transition-transform duration-150 active:scale-90 ${
        active ? "text-deep" : "text-muted hover:text-deep"
      } ${className}`}
    >
      <Heart
        className={`size-4 transition-colors ${active ? "fill-deep text-deep" : ""}`}
        strokeWidth={2}
      />
    </button>
  );
}
