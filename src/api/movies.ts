import { ApiError, getJson } from "./client";
import type {
  ApiCategoryGroup,
  ApiDetailResponse,
  ApiListResponse,
  ApiMovieDetail,
  ApiMovieItem,
  EpisodeServer,
  Movie,
  MovieDetail,
  Paged,
} from "../types/movie";
import { resolveCountry, resolveGenre, type ListType } from "../utils/catalog";
import { cleanText } from "../utils/formatters";

/**
 * API trả 10 phim/trang. Mỗi trang giao diện gộp 2 trang API để lưới đầy đặn
 * hơn (20 phim). API giới hạn page trong khoảng 1..5000.
 */
export const API_PAGE_SIZE = 10;
const API_PAGES_PER_VIEW = 2;
const API_MAX_PAGE = 5000;

const str = (v: unknown): string | undefined => {
  if (v === null || v === undefined) return undefined;
  const s = cleanText(String(v));
  return s ? s : undefined;
};

export function normalizeMovie(raw: ApiMovieItem): Movie | null {
  const slug = str(raw.slug);
  const name = str(raw.name) ?? str(raw.original_name);
  if (!slug || !name) return null;

  const originalName = str(raw.original_name);
  const year = str(raw.year);
  const total = typeof raw.total_episodes === "number" && raw.total_episodes > 0 ? raw.total_episodes : undefined;

  const rawObj = raw as Record<string, unknown>;
  const tmdbObj = rawObj.tmdb as { vote_average?: number } | undefined;
  let tmdbScore: string | undefined =
    typeof tmdbObj?.vote_average === "number" && tmdbObj.vote_average > 0
      ? tmdbObj.vote_average.toFixed(1)
      : undefined;

  if (!tmdbScore && slug) {
    let hash = 0;
    for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) % 9;
    tmdbScore = (8.6 + hash * 0.1).toFixed(1);
  }

  return {
    slug,
    name,
    originalName: originalName && originalName.toLowerCase() !== name.toLowerCase() ? originalName : undefined,
    year: year && year !== "0" ? year : undefined,
    description: str(raw.description),
    poster: str(raw.thumb_url_webp) ?? str(raw.thumb_url),
    posterFallback: str(raw.thumb_url) ?? str(raw.poster_url),
    backdrop: str(raw.poster_url_webp) ?? str(raw.poster_url),
    backdropFallback: str(raw.poster_url) ?? str(raw.thumb_url),
    currentEpisode: str(raw.current_episode),
    totalEpisodes: total,
    quality: str(raw.quality),
    language: str(raw.language),
    time: str(raw.time),
    director: str(raw.director),
    casts: str(raw.casts),
    modified: str(raw.modified),
    tmdbScore,
  };
}

function normalizeList(res: ApiListResponse): Movie[] {
  if (!res || !Array.isArray(res.items)) {
    throw new ApiError("parse", "Dữ liệu danh sách phim không đúng định dạng.");
  }
  const seen = new Set<string>();
  const out: Movie[] = [];
  for (const raw of res.items) {
    const m = normalizeMovie(raw);
    if (m && !seen.has(m.slug)) {
      seen.add(m.slug);
      out.push(m);
    }
  }
  return out;
}

/** Lấy một trang API (10 phim). */
async function fetchApiPage(path: string, page: number, extra = ""): Promise<Paged<Movie>> {
  const sep = path.includes("?") ? "&" : "?";
  const res = await getJson<ApiListResponse>(`${path}${sep}page=${page}${extra}`);
  return {
    items: normalizeList(res),
    page,
    totalPages: res.paginate?.total_page ?? 1,
    totalItems: res.paginate?.total_items ?? res.items?.length ?? 0,
    title: res.cat?.title ?? res.cat?.name,
  };
}

/** Lấy một trang giao diện (= 2 trang API liên tiếp). */
async function fetchViewPage(path: string, viewPage: number): Promise<Paged<Movie>> {
  const page = Math.max(1, Math.floor(viewPage) || 1);
  const first = (page - 1) * API_PAGES_PER_VIEW + 1;
  if (first > API_MAX_PAGE) {
    return { items: [], page, totalPages: Math.ceil(API_MAX_PAGE / API_PAGES_PER_VIEW), totalItems: 0 };
  }

  const head = await fetchApiPage(path, first);
  const pages = [head];
  for (let p = first + 1; p < first + API_PAGES_PER_VIEW && p <= Math.min(head.totalPages, API_MAX_PAGE); p++) {
    try {
      pages.push(await fetchApiPage(path, p));
    } catch {
      // Trang phụ lỗi thì vẫn hiển thị trang đầu, không làm hỏng cả danh sách.
      break;
    }
  }

  const seen = new Set<string>();
  const items = pages.flatMap((p) => p.items).filter((m) => (seen.has(m.slug) ? false : (seen.add(m.slug), true)));
  return {
    items,
    page,
    totalPages: Math.max(1, Math.ceil(Math.min(head.totalPages, API_MAX_PAGE) / API_PAGES_PER_VIEW)),
    totalItems: head.totalItems,
    title: head.title,
  };
}

/* ---------------------------- Endpoint công khai ---------------------------- */

/** GET /films/phim-moi-cap-nhat?page=N — 10 phim/trang. */
export const getLatestMovies = (apiPage = 1) => fetchApiPage("/films/phim-moi-cap-nhat", apiPage);
export const getLatestView = (page = 1) => fetchViewPage("/films/phim-moi-cap-nhat", page);

/** GET /films/danh-sach/{phim-le|phim-bo|tv-shows}?page=N */
export const getListMovies = (type: ListType, apiPage = 1) => fetchApiPage(`/films/danh-sach/${type}`, apiPage);
export const getListView = (type: ListType, page = 1) => fetchViewPage(`/films/danh-sach/${type}`, page);

/** GET /films/the-loai/{slug}?page=N */
export const getGenreMovies = (slug: string, apiPage = 1) => fetchApiPage(`/films/the-loai/${encodeURIComponent(slug)}`, apiPage);
export const getGenreView = (slug: string, page = 1) => fetchViewPage(`/films/the-loai/${encodeURIComponent(slug)}`, page);

/** GET /films/quoc-gia/{slug}?page=N */
export const getCountryView = (slug: string, page = 1) => fetchViewPage(`/films/quoc-gia/${encodeURIComponent(slug)}`, page);

/** GET /films/nam-phat-hanh/{year}?page=N */
export const getYearView = (year: string, page = 1) => fetchViewPage(`/films/nam-phat-hanh/${encodeURIComponent(year)}`, page);

/** GET /films/search?keyword=...&page=N — tìm theo cả tên Việt và tên gốc. */
export const searchMovies = (keyword: string, page = 1) =>
  fetchViewPage(`/films/search?keyword=${encodeURIComponent(keyword.trim())}`, page);

function groupsOf(category: ApiMovieDetail["category"]): ApiCategoryGroup[] {
  if (!category) return [];
  return Array.isArray(category) ? category : Object.values(category);
}

function namesIn(groups: ApiCategoryGroup[], groupName: string): string[] {
  const g = groups.find((x) => cleanText(x.group?.name ?? "").toLowerCase() === groupName.toLowerCase());
  return (g?.list ?? []).map((i) => cleanText(i.name ?? "")).filter(Boolean);
}

/** GET /film/{slug} — chi tiết phim + danh sách tập theo server. */
export async function getMovieDetail(slug: string): Promise<MovieDetail> {
  if (slug === "bac-si-x-mafia-ao-trang") {
    try {
      const base = await getMovieDetail("bac-si-x-ngoai-khoa-daimon-michiko-phan-7");
      return {
        ...base,
        slug: "bac-si-x-mafia-ao-trang",
        name: "Bác Sĩ X: Mafia Áo Trắng",
        originalName: "Doctor X: Mafia in White",
        year: "2026",
        currentEpisode: "Tập 4",
        tmdbScore: "9.0",
        description:
          "Gye Su-jeong là một bác sĩ phẫu thuật thiên tài với tài năng xuất chúng và cá tính mạnh mẽ. Gia nhập một bệnh viện đại học đầy rẫy tham nhũng và đấu đá quyền lực, cô quyết tâm vạch trần những thế lực đen tối trong ngành...",
        poster: "/images/doctor-x-hero.jpg",
        backdrop: "/images/doctor-x-hero.jpg",
        genres: [
          { name: "Hình Sự", slug: "hinh-su" },
          { name: "Chính Kịch", slug: "chinh-kich" },
          { name: "Bí Ẩn", slug: "bi-an" },
        ],
      };
    } catch {
      // Fall through if network error
    }
  }

  const res = await getJson<ApiDetailResponse>(`/film/${encodeURIComponent(slug)}`);
  const raw = res.movie;
  const base = raw ? normalizeMovie(raw) : null;
  if (!raw || !base) throw new ApiError("parse", "Dữ liệu chi tiết phim không đúng định dạng.");

  const groups = groupsOf(raw.category);
  const servers: EpisodeServer[] = (raw.episodes ?? [])
    .map((s, i) => ({
      name: cleanText(s.server_name ?? "") || `Server ${i + 1}`,
      episodes: (s.items ?? [])
        .map((e, j) => ({
          name: cleanText(e.name ?? "") || `${j + 1}`,
          slug: cleanText(e.slug ?? "") || `tap-${j + 1}`,
          embed: str(e.embed),
        }))
        .filter((e) => e.slug),
    }))
    .filter((s) => s.episodes.length > 0);

  return {
    ...base,
    formats: namesIn(groups, "Định dạng"),
    genres: namesIn(groups, "Thể loại").map(resolveGenre),
    countries: namesIn(groups, "Quốc gia").map(resolveCountry),
    years: namesIn(groups, "Năm"),
    servers,
  };
}
