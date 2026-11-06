import { Heart, Info, Play } from "lucide-react";
import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { getMovieDetail } from "../../api/movies";
import { usePreview } from "../../context/PreviewContext";
import { useFavorites } from "../../hooks/useFavorites";
import type { Movie } from "../../types/movie";
import { cleanText, truncate } from "../../utils/formatters";
import { ErrorState } from "../common/ErrorState";
import { PosterImage } from "../common/PosterImage";
import { useToast } from "../common/Toast";

interface Props {
  movies?: Movie[];
  loading: boolean;
  error?: unknown;
  onRetry: () => void;
}

const ROTATE_MS = 8000;

export const DOCTOR_X_FEATURED: Movie = {
  slug: "bac-si-x-mafia-ao-trang",
  name: "Bác Sĩ X: Mafia Áo Trắng",
  originalName: "Doctor X: Mafia in White",
  year: "2026",
  currentEpisode: "Tập 4",
  tmdbScore: "9.0",
  genres: ["Hình Sự", "Chính Kịch", "Bí Ẩn"],
  description:
    "Gye Su-jeong là một bác sĩ phẫu thuật thiên tài với tài năng xuất chúng và cá tính mạnh mẽ. Gia nhập một bệnh viện đại học đầy rẫy tham nhũng và đấu đá quyền lực, cô quyết tâm vạch trần những thế lực đen tối trong ngành...",
  backdrop: "/images/doctor-x-hero.jpg",
  backdropFallback: "/images/doctor-x-hero.jpg",
  poster: "/images/doctor-x-hero.jpg",
  posterFallback: "/images/doctor-x-hero.jpg",
  quality: "HD",
  time: "60 phút/tập",
};

/** Tiêu đề cách điệu BÁC SĨ X: MAFIA ÁO TRẮNG */
function DoctorXTitle() {
  return (
    <div className="select-none py-1">
      <div className="flex items-center gap-2 sm:gap-3">
        <span className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-black uppercase tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
          BÁC SĨ
        </span>
        <span className="relative inline-flex items-center justify-center text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-black italic text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-100 to-slate-400 drop-shadow-[0_0_18px_rgba(255,255,255,0.45)] transform -skew-x-6">
          X
        </span>
      </div>
      <div className="text-sm sm:text-base md:text-xl lg:text-[22px] font-black uppercase tracking-[0.22em] text-neutral-200 drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)] mt-0.5">
        MAFIA ÁO TRẮNG
      </div>
    </div>
  );
}

/** Hiển thị tiêu đề chuẩn cinema cho các phim khác */
function DynamicTitle({ name }: { name: string }) {
  const parts = name.split(/:\s*|\s+-\s+/);
  if (parts.length > 1) {
    return (
      <div className="select-none py-1">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[46px] font-black uppercase tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] leading-[1.1]">
          {parts[0].trim()}
        </h1>
        <div className="text-sm sm:text-base md:text-xl lg:text-[20px] font-extrabold uppercase tracking-[0.16em] text-neutral-200 drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)] mt-1 line-clamp-1">
          {parts.slice(1).join(" - ").trim()}
        </div>
      </div>
    );
  }

  return (
    <h1 className="select-none text-2xl sm:text-3xl md:text-4xl lg:text-[46px] font-black uppercase tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] leading-[1.1] line-clamp-2">
      {name}
    </h1>
  );
}

export function HeroBanner({ movies, loading, error, onRetry }: Props) {
  const { openPreview } = usePreview();
  const { isFavorite, toggle } = useFavorites();
  const toast = useToast();

  const picks = useMemo(() => {
    const valid = (movies ?? []).filter((m) => m.slug !== DOCTOR_X_FEATURED.slug && (m.backdrop || m.poster));
    const firstTwo = valid.slice(0, 2);
    const rest = valid.slice(2, 5);

    const list: Movie[] = [];
    if (firstTwo.length > 0) list.push(...firstTwo);
    list.push(DOCTOR_X_FEATURED);
    list.push(...rest);

    return list.slice(0, 6);
  }, [movies]);

  const [index, setIndex] = useState(() => (picks.length > 2 ? 2 : 0));
  const [paused, setPaused] = useState(false);
  const [genresMap, setGenresMap] = useState<Record<string, string[]>>({});

  const featured = picks[index] ?? DOCTOR_X_FEATURED;
  const isFav = featured ? isFavorite(featured.slug) : false;

  const reduceMotion = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const autoplay = picks.length > 1 && !paused && !reduceMotion;

  useEffect(() => {
    if (!autoplay) return;
    const t = setTimeout(() => {
      setIndex((i) => (i + 1) % picks.length);
    }, ROTATE_MS);
    return () => clearTimeout(t);
  }, [autoplay, index, picks.length]);

  useEffect(() => {
    if (!featured || featured.slug === DOCTOR_X_FEATURED.slug) return;
    if (genresMap[featured.slug]) return;

    let active = true;
    getMovieDetail(featured.slug)
      .then((detail) => {
        if (active && detail.genres?.length) {
          const names = detail.genres.map((g) => (typeof g === "string" ? g : g.name)).slice(0, 3);
          setGenresMap((prev) => ({ ...prev, [featured.slug]: names }));
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [featured, genresMap]);

  const handleToggleFavorite = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!featured) return;
    const added = toggle(featured);
    toast.show(added ? `Đã lưu “${featured.name}” vào góc yêu thích` : `Đã bỏ “${featured.name}” khỏi yêu thích`);
  };

  const displayGenres = useMemo(() => {
    if (featured.slug === DOCTOR_X_FEATURED.slug) {
      return ["Hình Sự", "Chính Kịch", "Bí Ẩn"];
    }
    if (genresMap[featured.slug]?.length) {
      return genresMap[featured.slug];
    }
    if (featured.genres?.length) {
      return featured.genres.map((g) => (typeof g === "string" ? g : g.name)).slice(0, 3);
    }
    return ["Chính Kịch", "Hành Động", "Gay Cấn"];
  }, [featured, genresMap]);

  if (loading && !featured) {
    return (
      <div className="relative min-h-[520px] sm:min-h-[580px] w-full bg-[#0c0c12] flex items-center" aria-busy="true">
        <div className="skeleton size-full absolute inset-0 opacity-30" />
      </div>
    );
  }

  if (error && !featured) {
    return (
      <section className="container-page py-10">
        <ErrorState error={error} onRetry={onRetry} />
      </section>
    );
  }

  return (
    <section
      className="relative w-full overflow-hidden bg-[#0c0c12] text-white select-none"
      aria-label="Phim nổi bật"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Khung Hero chiều cao điện ảnh chuẩn */}
      <div className="relative min-h-[500px] sm:min-h-[560px] md:min-h-[600px] lg:min-h-[640px] xl:min-h-[680px] w-full flex items-center">
        {/* Ảnh nền Artwork Full-Bleed tràn viền */}
        <div className="absolute inset-0 size-full overflow-hidden">
          {featured.backdrop || featured.poster ? (
            <img
              key={featured.slug}
              src={featured.backdrop || featured.poster}
              alt={featured.name}
              className="size-full object-cover object-[68%_25%] sm:object-[68%_30%] lg:object-[64%_center] transition-opacity duration-700 ease-out animate-fade"
              loading="eager"
            />
          ) : (
            <div className="skeleton size-full" />
          )}

          {/* Gradient Overlay phía bên trái làm nổi bật chữ */}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0c0c12] via-[#0c0c12]/85 to-transparent w-full md:w-[76%] lg:w-[65%]"
            aria-hidden="true"
          />

          {/* Gradient mềm ở mép dưới để chuyển mượt vào nội dung trang */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0c0c12] via-[#0c0c12]/60 to-transparent"
            aria-hidden="true"
          />

          {/* Gradient nhẹ ở đỉnh thanh điều hướng */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent"
            aria-hidden="true"
          />
        </div>

        {/* Cột thông tin bên trái — Container chuẩn trang web */}
        <div className="container-page relative z-10 w-full py-10 sm:py-14 lg:py-16">
          <div className="max-w-xl lg:max-w-2xl animate-fade" key={featured.slug}>
            {/* Tiêu đề phim */}
            {featured.slug === DOCTOR_X_FEATURED.slug ? (
              <DoctorXTitle />
            ) : (
              <DynamicTitle name={featured.name} />
            )}

            {/* Tên tiếng Anh / Tên gốc */}
            {featured.originalName && (
              <p className="mt-1.5 text-xs sm:text-sm md:text-base font-semibold text-[#f5c518] tracking-wide">
                {featured.originalName}
              </p>
            )}

            {/* Hàng huy hiệu Metadata: TMDB, Năm, Số tập */}
            <div className="mt-3.5 flex flex-wrap items-center gap-2 sm:gap-2.5">
              {/* TMDB Badge */}
              <div className="inline-flex items-center rounded bg-[#01b4e4] px-2 py-0.5 text-xs font-black text-white shadow-sm">
                <span className="tracking-wide mr-1.5">TMDB</span>
                <span className="font-bold">{featured.tmdbScore ?? "9.0"}</span>
              </div>

              {/* Year Badge */}
              {featured.year && (
                <span className="rounded border border-white/20 bg-black/60 px-2.5 py-0.5 text-xs font-semibold text-white">
                  {featured.year}
                </span>
              )}

              {/* Episode Badge */}
              {featured.currentEpisode && (
                <span className="rounded border border-white/20 bg-black/60 px-2.5 py-0.5 text-xs font-semibold text-white">
                  {featured.currentEpisode}
                </span>
              )}
            </div>

            {/* Hàng Thể loại Phim */}
            {displayGenres.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {displayGenres.map((genre) => (
                  <span
                    key={genre}
                    className="rounded border border-white/15 bg-black/50 px-2.5 py-0.5 text-xs font-medium text-white/90"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Đoạn tóm tắt nội dung phim */}
            {featured.description && (
              <p className="mt-3.5 line-clamp-3 max-w-xl text-xs sm:text-sm md:text-[14px] leading-relaxed text-neutral-300 font-normal">
                {truncate(cleanText(featured.description), 230)}
              </p>
            )}

            {/* Hàng nút hành động chuẩn Streaming: Xem ngay (Vàng) - Yêu thích - Chi tiết */}
            <div className="mt-6 flex items-center gap-2.5 sm:gap-3">
              {/* Nút Xem phim màu vàng nổi bật */}
              <Link
                to={`/xem-phim/${featured.slug}`}
                aria-label={`Xem phim ${featured.name}`}
                className="btn-play h-11 px-5 sm:px-6 rounded-md text-sm sm:text-base font-bold flex items-center gap-2"
              >
                <Play className="size-4.5 fill-black text-black" />
                <span>Xem ngay</span>
              </Link>

              {/* Nút Yêu thích */}
              <button
                type="button"
                onClick={handleToggleFavorite}
                aria-pressed={isFav}
                aria-label={isFav ? "Bỏ khỏi yêu thích" : "Lưu vào yêu thích"}
                title={isFav ? "Bỏ khỏi yêu thích" : "Lưu vào yêu thích"}
                className={`btn h-11 px-3.5 sm:px-4 rounded-md text-xs sm:text-sm font-semibold border transition-colors ${
                  isFav
                    ? "border-deep bg-deep/20 text-white"
                    : "border-white/20 bg-black/60 text-white hover:bg-black/90 hover:border-white/40"
                }`}
              >
                <Heart
                  className={`size-4 ${isFav ? "fill-deep text-deep" : "text-white"}`}
                  strokeWidth={2}
                />
                <span className="hidden sm:inline">{isFav ? "Đã lưu" : "Yêu thích"}</span>
              </button>

              {/* Nút Chi tiết */}
              <button
                type="button"
                onClick={() => openPreview(featured)}
                aria-label={`Xem thông tin ${featured.name}`}
                title="Xem nhanh thông tin phim"
                className="btn h-11 px-3.5 sm:px-4 rounded-md text-xs sm:text-sm font-semibold border border-white/20 bg-black/60 text-white hover:bg-black/90 hover:border-white/40 transition-colors"
              >
                <Info className="size-4 text-white" strokeWidth={2.2} />
                <span className="hidden sm:inline">Chi tiết</span>
              </button>
            </div>
          </div>
        </div>

        {/* Thumbnail Filmstrip Selector — Neo ở góc dưới cùng bên phải màn hình */}
        {picks.length > 1 && (
          <div
            className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 lg:right-10 z-20 flex max-w-[calc(100vw-2rem)] items-center gap-2 sm:gap-2.5 overflow-x-auto p-1 scrollbar-none"
            role="group"
            aria-label="Chọn phim xem nổi bật"
          >
            {picks.map((m, i) => {
              const isActive = i === index;
              return (
                <button
                  key={`${m.slug}-${i}`}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Chọn phim ${m.name}`}
                  aria-pressed={isActive}
                  className={`relative aspect-video w-16 sm:w-20 md:w-24 lg:w-28 shrink-0 overflow-hidden rounded-md transition-all duration-200 ${
                    isActive
                      ? "border-2 border-play shadow-lg scale-105 z-10 opacity-100"
                      : "border border-white/20 opacity-60 hover:opacity-100 hover:scale-105"
                  }`}
                >
                  <PosterImage
                    src={m.backdrop ?? m.poster}
                    fallback={m.backdropFallback ?? m.posterFallback}
                    alt={m.name}
                    className="size-full object-cover"
                  />

                  {/* Thanh tiến trình chạy theo chu kỳ auto-play khi slide đang kích hoạt */}
                  {isActive && autoplay && (
                    <span
                      key={`bar-${index}`}
                      className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-play"
                      style={{ animation: `progress ${ROTATE_MS}ms linear forwards` }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
