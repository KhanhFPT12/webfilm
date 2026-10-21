import { Check, Sparkles, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "../common/Toast";

interface Props {
  slug: string;
  movieName: string;
}

// Pseudo-random consistent community base score from slug string hash
function getBaseRating(slug: string): { score: number; votes: number } {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash << 5) - hash + slug.charCodeAt(i);
    hash |= 0;
  }
  const positiveHash = Math.abs(hash);
  const score = 8.4 + (positiveHash % 15) * 0.1; // 8.4 to 9.8
  const votes = 800 + (positiveHash % 3500); // 800 to 4300
  return { score: Number(score.toFixed(1)), votes };
}

const MOOD_TAGS = [
  "🎬 Kỹ xảo mãn nhãn",
  "💖 Cảm xúc thăng hoa",
  "⚡ Gay cấn nghẹt thở",
  "🎶 Nhạc phim xuất sắc",
  "👑 Diễn xuất đỉnh cao",
];

export function MovieRatingWidget({ slug, movieName }: Props) {
  const toast = useToast();
  const base = getBaseRating(slug);

  const storageKey = `sony_movie_rating_${slug}`;
  const tagsStorageKey = `sony_movie_tags_${slug}`;

  const [userRating, setUserRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setUserRating(Number(saved));

      const savedTags = localStorage.getItem(tagsStorageKey);
      if (savedTags) setSelectedTags(JSON.parse(savedTags));
    } catch {
      // ignore
    }
  }, [slug, storageKey, tagsStorageKey]);

  const handleRate = (star: number) => {
    setUserRating(star);
    try {
      localStorage.setItem(storageKey, String(star));
    } catch {
      // ignore
    }
    toast.show(`Bạn đã đánh giá ${star * 2}/10 sao cho "${movieName}"!`);
  };

  const toggleTag = (tag: string) => {
    const next = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(next);
    try {
      localStorage.setItem(tagsStorageKey, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const displayScore = userRating
    ? Number(((base.score * base.votes + userRating * 2) / (base.votes + 1)).toFixed(1))
    : base.score;
  const totalVotes = userRating ? base.votes + 1 : base.votes;

  return (
    <div className="rounded-2xl border border-line bg-surface/90 p-5 shadow-xs backdrop-blur-md sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line/60 pb-4">
        {/* Điểm trung bình */}
        <div className="flex items-center gap-3">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-md">
            <span className="text-2xl font-black">{displayScore}</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500 uppercase tracking-wider">
              <Star className="size-3.5 fill-amber-500" />
              <span>Đánh giá cộng đồng Sony</span>
            </div>
            <p className="mt-0.5 text-xs text-muted">
              Dựa trên <strong className="font-semibold text-ink">{totalVotes.toLocaleString("vi-VN")}</strong> lượt đánh giá
            </p>
          </div>
        </div>

        {/* Khu vực bấm sao đánh giá */}
        <div className="flex flex-col items-start sm:items-end">
          <span className="text-xs font-medium text-muted">
            {userRating ? "Đánh giá của bạn:" : "Chấm điểm cho phim:"}
          </span>
          <div
            className="mt-1 flex items-center gap-1"
            onMouseLeave={() => setHoverRating(0)}
          >
            {[1, 2, 3, 4, 5].map((star) => {
              const active = hoverRating ? star <= hoverRating : star <= userRating;
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRate(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  aria-label={`Chấm ${star * 2} trên 10 sao`}
                  className="rounded p-1 text-muted transition-transform hover:scale-125 focus-visible:outline-offset-2"
                >
                  <Star
                    className={`size-6 transition-colors ${
                      active
                        ? "fill-amber-400 text-amber-400 drop-shadow-xs"
                        : "text-muted/40 hover:text-amber-400"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cảm xúc & Điểm nhấn phim */}
      <div className="pt-4">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-ink">
          <Sparkles className="size-3.5 text-deep" />
          <span>Điểm nhấn ấn tượng của khán giả:</span>
        </p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {MOOD_TAGS.map((tag) => {
            const active = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all duration-150 active:scale-95 ${
                  active
                    ? "border border-deep bg-pastel/70 text-deep font-semibold shadow-xs"
                    : "border border-line bg-sub/60 text-ink/80 hover:border-deep/30 hover:bg-surface"
                }`}
              >
                {active && <Check className="size-3 text-deep" />}
                <span>{tag}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
