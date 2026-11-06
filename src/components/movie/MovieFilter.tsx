import { ArrowRight, ChevronDown, RotateCcw, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { COUNTRIES, GENRES, currentYear } from "../../utils/catalog";

export interface FilterState {
  country?: string;
  type?: string;
  audio?: string;
  genre?: string;
  year?: string;
  sort?: "latest" | "views" | "imdb";
}

interface MovieFilterProps {
  initialValues?: FilterState;
  onFilter?: (state: FilterState) => void;
  onClose?: () => void;
  isOpen?: boolean;
  collapsible?: boolean;
  className?: string;
}

const TYPE_OPTIONS = [
  { slug: "all", name: "Tất cả" },
  { slug: "phim-bo", name: "Phim bộ" },
  { slug: "phim-le", name: "Phim lẻ" },
  { slug: "tv-shows", name: "TV Shows" },
  { slug: "hoat-hinh", name: "Hoạt hình" },
];

const AUDIO_OPTIONS = [
  { slug: "all", name: "Tất cả" },
  { slug: "thuyet-minh", name: "Thuyết Minh" },
  { slug: "long-tieng", name: "Lồng Tiếng" },
  { slug: "vietsub", name: "Vietsub" },
];

const SORT_OPTIONS: { slug: "latest" | "views" | "imdb"; name: string }[] = [
  { slug: "latest", name: "Mới Nhất" },
  { slug: "views", name: "Lượt Xem" },
  { slug: "imdb", name: "Điểm IMDb" },
];

export function MovieFilter({
  initialValues,
  onFilter,
  onClose,
  isOpen: defaultOpen = true,
  collapsible = true,
  className = "",
}: MovieFilterProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(defaultOpen);

  const [country, setCountry] = useState(initialValues?.country || "all");
  const [type, setType] = useState(initialValues?.type || "all");
  const [audio, setAudio] = useState(initialValues?.audio || "all");
  const [genre, setGenre] = useState(initialValues?.genre || "all");
  const [year, setYear] = useState(initialValues?.year || "all");
  const [sort, setSort] = useState<"latest" | "views" | "imdb">(initialValues?.sort || "latest");

  const [expandedCountries, setExpandedCountries] = useState(false);

  // Generate years list from current year down to 2010
  const years = useMemo(() => {
    const thisYear = currentYear();
    const list: { slug: string; name: string }[] = [{ slug: "all", name: "Tất cả" }];
    for (let y = thisYear; y >= 2010; y--) {
      list.push({ slug: String(y), name: String(y) });
    }
    return list;
  }, []);

  // Genres formatted with "Tất cả" option
  const genreOptions = useMemo(() => {
    return [{ slug: "all", name: "Tất cả" }, ...GENRES.map((g) => ({ slug: g.slug, name: g.name }))];
  }, []);

  // Countries formatted with "Tất cả" option
  const countryOptions = useMemo(() => {
    return [{ slug: "all", name: "Tất cả" }, ...COUNTRIES.map((c) => ({ slug: c.slug, name: c.name }))];
  }, []);

  // Determine active count
  const activeCount = useMemo(() => {
    let count = 0;
    if (country !== "all") count++;
    if (type !== "all") count++;
    if (audio !== "all") count++;
    if (genre !== "all") count++;
    if (year !== "all") count++;
    if (sort !== "latest") count++;
    return count;
  }, [country, type, audio, genre, year, sort]);

  const handleReset = () => {
    setCountry("all");
    setType("all");
    setAudio("all");
    setGenre("all");
    setYear("all");
    setSort("latest");
  };

  const handleApply = () => {
    const filterState: FilterState = {
      country: country !== "all" ? country : undefined,
      type: type !== "all" ? type : undefined,
      audio: audio !== "all" ? audio : undefined,
      genre: genre !== "all" ? genre : undefined,
      year: year !== "all" ? year : undefined,
      sort,
    };

    if (onFilter) {
      onFilter(filterState);
    } else {
      // Build search params and navigate to /loc-phim
      const params = new URLSearchParams();
      if (filterState.country) params.set("country", filterState.country);
      if (filterState.type) params.set("type", filterState.type);
      if (filterState.audio) params.set("audio", filterState.audio);
      if (filterState.genre) params.set("genre", filterState.genre);
      if (filterState.year) params.set("year", filterState.year);
      if (filterState.sort && filterState.sort !== "latest") params.set("sort", filterState.sort);

      const qs = params.toString();
      navigate(`/loc-phim${qs ? `?${qs}` : ""}`);
    }
  };

  const handleClose = () => {
    if (onClose) onClose();
    else setOpen(false);
  };

  const visibleCountries = expandedCountries ? countryOptions : countryOptions.slice(0, 24);

  return (
    <div className={`w-full select-none ${className}`}>
      {/* Toggle button when collapsed */}
      {collapsible && !open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 hover:border-amber-500/40 text-sm font-medium transition-all shadow-md group cursor-pointer"
        >
          <SlidersHorizontal className="size-4 text-amber-400 transition-transform group-hover:rotate-45" />
          <span>Bộ lọc phim</span>
          {activeCount > 0 && (
            <span className="flex items-center justify-center h-5 px-1.5 text-xs font-bold rounded-full bg-amber-400 text-zinc-950">
              {activeCount}
            </span>
          )}
          <ChevronDown className="size-4 text-zinc-400 ml-1" />
        </button>
      )}

      {/* Main Filter Panel */}
      {open && (
        <div className="bg-[#0f1118] border border-zinc-800/90 rounded-2xl p-4 sm:p-6 shadow-2xl text-zinc-200 space-y-4">
          {/* Row 1: Quốc gia */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 py-1.5 border-b border-zinc-800/50">
            <span className="w-28 shrink-0 text-sm font-semibold text-zinc-300 pt-1">Quốc gia:</span>
            <div className="flex flex-wrap items-center gap-1.5 flex-1">
              {visibleCountries.map((c) => {
                const isActive = country === c.slug;
                return (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => setCountry(c.slug)}
                    className={`px-2.5 py-1 rounded text-xs sm:text-[13px] transition-all cursor-pointer ${
                      isActive
                        ? "border border-amber-400 text-amber-400 bg-amber-400/10 font-semibold shadow-xs"
                        : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60"
                    }`}
                  >
                    {c.name}
                  </button>
                );
              })}
              {countryOptions.length > 24 && (
                <button
                  type="button"
                  onClick={() => setExpandedCountries(!expandedCountries)}
                  className="px-2 py-1 text-xs text-amber-400 hover:text-amber-300 underline font-medium cursor-pointer"
                >
                  {expandedCountries ? "Thu gọn ▲" : `Xem thêm (${countryOptions.length - 24}) ▼`}
                </button>
              )}
            </div>
          </div>

          {/* Row 2: Loại phim */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 py-1.5 border-b border-zinc-800/50">
            <span className="w-28 shrink-0 text-sm font-semibold text-zinc-300 pt-1">Loại phim:</span>
            <div className="flex flex-wrap items-center gap-1.5 flex-1">
              {TYPE_OPTIONS.map((t) => {
                const isActive = type === t.slug;
                return (
                  <button
                    key={t.slug}
                    type="button"
                    onClick={() => setType(t.slug)}
                    className={`px-3 py-1 rounded text-xs sm:text-[13px] transition-all cursor-pointer ${
                      isActive
                        ? "border border-amber-400 text-amber-400 bg-amber-400/10 font-semibold shadow-xs"
                        : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60"
                    }`}
                  >
                    {t.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 3: Âm thanh */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 py-1.5 border-b border-zinc-800/50">
            <span className="w-28 shrink-0 text-sm font-semibold text-zinc-300 pt-1">Âm thanh:</span>
            <div className="flex flex-wrap items-center gap-1.5 flex-1">
              {AUDIO_OPTIONS.map((a) => {
                const isActive = audio === a.slug;
                return (
                  <button
                    key={a.slug}
                    type="button"
                    onClick={() => setAudio(a.slug)}
                    className={`px-3 py-1 rounded text-xs sm:text-[13px] transition-all cursor-pointer ${
                      isActive
                        ? "border border-amber-400 text-amber-400 bg-amber-400/10 font-semibold shadow-xs"
                        : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60"
                    }`}
                  >
                    {a.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 4: Thể loại */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 py-1.5 border-b border-zinc-800/50">
            <span className="w-28 shrink-0 text-sm font-semibold text-zinc-300 pt-1">Thể loại:</span>
            <div className="flex flex-wrap items-center gap-1.5 flex-1">
              {genreOptions.map((g) => {
                const isActive = genre === g.slug;
                return (
                  <button
                    key={g.slug}
                    type="button"
                    onClick={() => setGenre(g.slug)}
                    className={`px-2.5 py-1 rounded text-xs sm:text-[13px] transition-all cursor-pointer ${
                      isActive
                        ? "border border-amber-400 text-amber-400 bg-amber-400/10 font-semibold shadow-xs"
                        : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60"
                    }`}
                  >
                    {g.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 5: Năm sản xuất */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 py-1.5 border-b border-zinc-800/50">
            <span className="w-28 shrink-0 text-sm font-semibold text-zinc-300 pt-1">Năm sản xuất:</span>
            <div className="flex flex-wrap items-center gap-1.5 flex-1">
              {years.map((y) => {
                const isActive = year === y.slug;
                return (
                  <button
                    key={y.slug}
                    type="button"
                    onClick={() => setYear(y.slug)}
                    className={`px-2.5 py-1 rounded text-xs sm:text-[13px] transition-all cursor-pointer ${
                      isActive
                        ? "border border-amber-400 text-amber-400 bg-amber-400/10 font-semibold shadow-xs"
                        : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60"
                    }`}
                  >
                    {y.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 6: Sắp xếp */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 py-1.5">
            <span className="w-28 shrink-0 text-sm font-semibold text-zinc-300 pt-1">Sắp xếp:</span>
            <div className="flex flex-wrap items-center gap-1.5 flex-1">
              {SORT_OPTIONS.map((s) => {
                const isActive = sort === s.slug;
                return (
                  <button
                    key={s.slug}
                    type="button"
                    onClick={() => setSort(s.slug)}
                    className={`px-3 py-1 rounded text-xs sm:text-[13px] transition-all cursor-pointer ${
                      isActive
                        ? "border border-amber-400 text-amber-400 bg-amber-400/10 font-semibold shadow-xs"
                        : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60"
                    }`}
                  >
                    {s.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions Bar at bottom */}
          <div className="pt-3 flex flex-wrap items-center gap-3 border-t border-zinc-800/70">
            <button
              type="button"
              onClick={handleApply}
              className="bg-[#f5c518] hover:bg-[#eab308] text-black font-bold px-6 py-2.5 rounded-lg text-sm flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              <span>Lọc kết quả</span>
              <ArrowRight className="size-4" />
            </button>

            {collapsible && (
              <button
                type="button"
                onClick={handleClose}
                className="bg-zinc-800 hover:bg-zinc-700/80 border border-zinc-700 text-zinc-300 hover:text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
              >
                Đóng
              </button>
            )}

            {activeCount > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="text-zinc-400 hover:text-rose-400 text-xs sm:text-sm font-medium px-3 py-2 flex items-center gap-1.5 transition-colors cursor-pointer ml-auto"
              >
                <RotateCcw className="size-3.5" />
                <span>Đặt lại ({activeCount})</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
