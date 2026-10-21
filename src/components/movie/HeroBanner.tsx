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

/** Component hiển thị logo tiêu đề cách điệu BÁC SĨ X: MAFIA ÁO TRẮNG giống chuẩn screenshot */
function DoctorXTitle() {
  return (
    <div className="select-none py-1">
      <div className="flex items-center gap-2 sm:gap-3">
        <span className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-black uppercase tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
          BÁC SĨ
        </span>
        <span className="relative inline-flex items-center justify-center text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-black italic text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-100 to-slate-400 drop-shadow-[0_0_18px_rgba(255,255,255,0.45)] transform -skew-x-6">
          X
          <span className="absolute inset-0 text-white/20 blur-[1px]" aria-hidden="true">
            X
          </span>
        </span>
      </div>
      <div className="text-sm sm:text-base md:text-xl lg:text-[23px] font-black uppercase tracking-[0.24em] text-neutral-200 drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)] mt-0.5">
        MAFIA ÁO TRẮNG
      </div>
    </div>
  );
}

/** Hiển thị tiêu đề chuẩn cinema cho các phim khác khi chuyển slide */
function DynamicTitle({ name }: { name: string }) {
  const parts = name.split(/:\s*|\s+-\s+/);
  if (parts.length > 1) {
    return (
      <div className="select-none py-1">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[46px] font-black uppercase tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] leading-[1.1]">
          {parts[0].trim()}
        </h1>
        <div className="text-sm sm:text-base md:text-xl lg:text-[22px] font-extrabold uppercase tracking-[0.16em] text-neutral-200 drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)] mt-1 line-clamp-1">
          {parts.slice(1).join(" - ").trim()}
        </div>
      </div>
    );
  }

  return (
    <h1 className="select-none text-2xl sm:text-3xl md:text-4xl lg:text-[48px] font-black uppercase tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] leading-[1.1] line-clamp-2">
      {name}
    </h1>
  );
}

export function HeroBanner({ movies, loading, error, onRetry }: Props) {
  const { openPreview } = usePreview();
  const { isFavorite, toggle } = useFavorites();
  const toast = useToast();

  // Xây dựng danh sách 6 phim nổi bật:
  // Đặt Doctor X vào vị trí index = 2 (phần tử thứ 3), 2 phim trước và 3 phim sau, khớp chính xác 1:1 với ảnh chụp người dùng gửi!
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

  // Khởi tạo index = 2 (Doctor X) nếu danh sách có ít nhất 3 phim, ngược lại index = 0
  const [index, setIndex] = useState(() => (picks.length > 2 ? 2 : 0));
  const [paused, setPaused] = useState(false);
  const [genresMap, setGenresMap] = useState<Record<string, string[]>>({});

  const featured = picks[index] ?? DOCTOR_X_FEATURED;
  const isFav = featured ? isFavorite(featured.slug) : false;

  const reduceMotion = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const autoplay = picks.length > 1 && !paused && !reduceMotion;

  // Tự động xoay vòng slide
  useEffect(() => {
    if (!autoplay) return;
    const t = setTimeout(() => {
      setIndex((i) => (i + 1) % picks.length);
    }, ROTATE_MS);
    return () => clearTimeout(t);
  }, [autoplay, index, picks.length]);

  // Tải chi tiết thể loại cho phim hiện tại nếu chưa có
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

  // Lấy danh sách thể loại hiển thị
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
      <div className="relative min-h-[520px] sm:min-h-[580px] w-full bg-[#0c0d14] flex items-center" aria-busy="true">
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
      className="relative w-full overflow-hidden bg-[#0c0d14] text-white select-none"
      aria-label="Phim nổi bật"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Khung Hero chiều cao điện ảnh chuẩn */}
      <div className="relative min-h-[520px] sm:min-h-[560px] md:min-h-[600px] lg:min-h-[640px] xl:min-h-[680px] w-full flex items-center">
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
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0c0d14] via-[#0c0d14]/85 to-transparent w-full md:w-[76%] lg:w-[65%]"
            aria-hidden="true"
          />

          {/* Gradient mềm ở mép dưới để chuyển mượt vào nội dung trang */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0c0d14] via-[#0c0d14]/60 to-transparent"
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

            {/* Tên tiếng Anh / Tên gốc (Màu vàng kim ấm áp) */}
            {featured.originalName && (
              <p className="mt-1.5 text-xs sm:text-sm md:text-base font-semibold text-[#f5c518] tracking-wide drop-shadow-sm">
                {featured.originalName}
              </p>
            )}

            {/* Hàng huy hiệu Metadata: TMDB, Năm, Số tập */}
            <div className="mt-3.5 flex flex-wrap items-center gap-2 sm:gap-2.5">
              {/* TMDB Badge */}
              <div className="inline-flex items-center rounded-md bg-[#01b4e4] px-2 py-0.5 text-xs font-black text-white shadow-sm">
                <span className="tracking-wide mr-1.5">TMDB</span>
                <span className="font-bold">{featured.tmdbScore ?? "9.0"}</span>
              </div>

              {/* Year Badge */}
              {featured.year && (
                <span className="rounded-md border border-white/20 bg-black/40 px-2.5 py-0.5 text-xs font-semibold text-white/90 backdrop-blur-xs">
                  {featured.year}
                </span>
              )}

              {/* Episode Badge */}
              {featured.currentEpisode && (
                <span className="rounded-md border border-white/20 bg-black/40 px-2.5 py-0.5 text-xs font-semibold text-white/90 backdrop-blur-xs">
                  {featured.currentEpisode}
                </span>
              )}
            </div>

            {/* Hàng Thể loại Phim (Genres Tags) */}
            {displayGenres.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {displayGenres.map((genre) => (
                  <span
                    key={genre}
                    className="rounded-md border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-xs transition-colors hover:bg-white/20 cursor-default"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Đoạn tóm tắt nội dung phim */}
            {featured.description && (
              <p className="mt-3.5 line-clamp-3 max-w-xl text-xs sm:text-sm md:text-[14px] leading-relaxed text-white/80 drop-shadow-sm font-normal">
                {truncate(cleanText(featured.description), 230)}
              </p>
            )}

            {/* 3 Nút Hành Động Tròn: Xem phim (Vàng) - Yêu thích (Kính) - Thông tin (Kính) */}
            <div className="mt-6 flex items-center gap-3 sm:gap-3.5">
              {/* Nút Xem phim tròn màu vàng nổi bật */}
              <Link
                to={`/xem-phim/${featured.slug}`}
                aria-label={`Xem phim ${featured.name}`}
                title="Xem phim ngay"
                className="group flex size-12 sm:size-13 items-center justify-center rounded-full bg-[#f5c518] text-black shadow-lg shadow-black/50 transition-all duration-200 hover:scale-105 hover:bg-[#ffcf25] active:scale-95"
              >
                <Play className="size-5 sm:size-6 fill-black text-black ml-0.5 transition-transform group-hover:scale-110" />
              </Link>

              {/* Nút Trái tim / Yêu thích tròn hiệu ứng kính */}
              <button
                type="button"
                onClick={handleToggleFavorite}
                aria-pressed={isFav}
                aria-label={isFav ? "Bỏ khỏi yêu thích" : "Lưu vào yêu thích"}
                title={isFav ? "Bỏ khỏi yêu thích" : "Lưu vào yêu thích"}
                className="flex size-11 sm:size-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-white/20 hover:border-white/30 active:scale-95"
              >
                <Heart
                  className={`size-5 transition-colors ${
                    isFav ? "fill-red-500 text-red-500" : "text-white"
                  }`}
                  strokeWidth={2}
                />
              </button>

              {/* Nút Thông tin tròn hiệu ứng kính */}
              <button
                type="button"
                onClick={() => openPreview(featured)}
                aria-label={`Xem thông tin ${featured.name}`}
                title="Xem nhanh thông tin phim"
                className="flex size-11 sm:size-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-white/20 hover:border-white/30 active:scale-95"
              >
                <Info className="size-5 text-white" strokeWidth={2.2} />
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
                  className={`relative aspect-video w-16 sm:w-20 md:w-24 lg:w-28 shrink-0 overflow-hidden rounded-lg sm:rounded-xl transition-all duration-300 ${
                    isActive
                      ? "border-2 border-white ring-2 ring-white/35 shadow-2xl scale-105 sm:scale-110 z-10 opacity-100"
                      : "border border-white/20 opacity-55 hover:opacity-100 hover:scale-105"
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
                      className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-white shadow-xs"
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
