import { Clock, Heart, Info, Play, Share2, Sparkles, X } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { usePreview } from "../../context/PreviewContext";
import { useFavorites } from "../../hooks/useFavorites";
import { PosterImage } from "../common/PosterImage";
import { useToast } from "../common/Toast";

export function QuickPreviewModal() {
  const { previewMovie, closePreview } = usePreview();
  const { isFavorite, toggle } = useFavorites();
  const toast = useToast();

  useEffect(() => {
    if (!previewMovie) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePreview();
    };

    // Lock body scroll
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = origOverflow;
    };
  }, [previewMovie, closePreview]);

  if (!previewMovie) return null;

  const m = previewMovie;
  const fav = isFavorite(m.slug);

  const handleShare = async () => {
    const url = `${window.location.origin}/phim/${m.slug}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: m.name,
          text: `Xem phim ${m.name} trên SONY Cinema`,
          url,
        });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.show("Đã sao chép liên kết phim vào bộ nhớ tạm");
    } catch {
      toast.show("Đã sao chép liên kết phim!");
    }
  };

  const metaList = [
    m.year,
    m.quality,
    m.currentEpisode,
    m.time,
    m.language,
  ].filter(Boolean);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Xem nhanh ${m.name}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-200"
        onClick={closePreview}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-line/80 bg-surface shadow-2xl transition-all duration-300 animate-rise sm:max-w-3xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={closePreview}
          aria-label="Đóng cửa sổ xem nhanh"
          className="absolute top-3 right-3 z-20 flex size-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-transform hover:scale-110 hover:bg-black/80"
        >
          <X className="size-4.5" />
        </button>

        {/* Media Header Banner (16:9 or 21:9) */}
        <div className="relative aspect-video w-full max-h-[290px] overflow-hidden bg-sub sm:max-h-[340px]">
          <PosterImage
            src={m.backdrop ?? m.poster}
            fallback={m.backdropFallback ?? m.posterFallback}
            alt={m.name}
            className="size-full object-cover"
          />

          {/* Vignette Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-black/30" />

          {/* Top highlight badge */}
          <div className="absolute top-3.5 left-4 z-10 flex items-center gap-1.5 rounded-full bg-deep/90 px-3 py-1 text-[11px] font-semibold text-white shadow-sm backdrop-blur-md">
            <Sparkles className="size-3" />
            <span>Xem nhanh phim</span>
          </div>

          {/* Floating Actions on Artwork */}
          <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-end justify-between gap-3 sm:bottom-5 sm:left-6 sm:right-6">
            <div className="min-w-0 max-w-xl">
              <h2 className="text-xl font-bold tracking-tight text-white drop-shadow-md sm:text-2xl lg:text-3xl">
                {m.name}
              </h2>
              {m.originalName && (
                <p className="mt-0.5 truncate text-xs text-white/80 drop-shadow-sm sm:text-sm">
                  {m.originalName}
                </p>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => toggle(m)}
                aria-label={fav ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
                className={`flex size-10 items-center justify-center rounded-full border transition-transform duration-150 active:scale-90 ${
                  fav
                    ? "border-rose bg-deep text-white shadow-glow-sm"
                    : "border-white/30 bg-black/40 text-white backdrop-blur-md hover:bg-black/60"
                }`}
              >
                <Heart className={`size-4.5 ${fav ? "fill-white" : ""}`} />
              </button>

              <button
                type="button"
                onClick={handleShare}
                aria-label="Chia sẻ phim"
                className="flex size-10 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-md transition-transform duration-150 hover:bg-black/60 active:scale-90"
              >
                <Share2 className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6">
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {m.quality && (
              <span className="badge-quality rounded-md px-2 py-0.5 text-xs font-semibold">
                {m.quality}
              </span>
            )}
            {m.currentEpisode && (
              <span className="badge-vip rounded-md px-2 py-0.5 text-xs font-bold">
                {m.currentEpisode}
              </span>
            )}
            {metaList.map((item) => (
              <span
                key={item}
                className="rounded-md border border-line bg-sub/60 px-2 py-0.5 text-xs font-medium text-muted"
              >
                {item}
              </span>
            ))}
          </div>

          {/* Description */}
          {m.description && (
            <p className="mt-3.5 line-clamp-4 text-xs leading-relaxed text-ink/80 sm:text-sm">
              {m.description}
            </p>
          )}

          {/* Action CTAs */}
          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-line/60 pt-4">
            <Link
              to={`/xem-phim/${m.slug}`}
              onClick={closePreview}
              className="btn-primary shadow-glow-sm h-11 px-6 text-sm font-semibold"
            >
              <Play className="size-4 fill-white" />
              <span>Xem phim ngay</span>
            </Link>

            <Link
              to={`/phim/${m.slug}`}
              onClick={closePreview}
              className="btn-secondary h-11 px-5 text-sm font-semibold"
            >
              <Info className="size-4" />
              <span>Chi tiết tác phẩm</span>
            </Link>

            {m.time && (
              <span className="ml-auto hidden items-center gap-1.5 text-xs text-muted sm:flex">
                <Clock className="size-3.5 text-deep" />
                <span>Thời lượng: {m.time}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
