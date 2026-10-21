/**
 * Kiểu dữ liệu phản hồi thô từ NguonC (đã xác minh bằng request thực tế
 * ngày 13/10/2026). Mọi trường đều có thể thiếu/null nên khai báo optional.
 */

export interface ApiPaginate {
  current_page: number;
  total_page: number;
  total_items: number;
  items_per_page: number;
}

export interface ApiMovieItem {
  id?: string;
  name?: string | null;
  original_name?: string | null;
  slug?: string | null;
  /** Danh sách trả về chuỗi "2026", chi tiết trả về số 2026. */
  year?: string | number | null;
  description?: string | null;
  total_episodes?: number | null;
  current_episode?: string | null;
  time?: string | null;
  quality?: string | null;
  language?: string | null;
  director?: string | null;
  casts?: string | null;
  /** Ảnh DỌC (khoảng 336x504) — dùng làm poster card. */
  thumb_url?: string | null;
  thumb_url_webp?: string | null;
  /** Ảnh NGANG (khoảng 1280x720) — dùng làm ảnh nền/banner. */
  poster_url?: string | null;
  poster_url_webp?: string | null;
  created?: string | null;
  modified?: string | null;
}

export interface ApiListResponse {
  status: string;
  message?: string;
  paginate?: ApiPaginate;
  cat?: { name?: string; title?: string; slug?: string };
  items?: ApiMovieItem[];
}

export interface ApiCategoryGroup {
  group?: { id?: string; name?: string };
  list?: { id?: string; name?: string }[];
}

export interface ApiEpisodeItem {
  name?: string | null;
  slug?: string | null;
  embed?: string | null;
}

export interface ApiEpisodeServer {
  server_name?: string | null;
  items?: ApiEpisodeItem[] | null;
}

export interface ApiMovieDetail extends ApiMovieItem {
  category?: Record<string, ApiCategoryGroup> | ApiCategoryGroup[] | null;
  episodes?: ApiEpisodeServer[] | null;
}

export interface ApiDetailResponse {
  status: string;
  message?: string;
  movie?: ApiMovieDetail;
}

/* ---------- Kiểu dữ liệu đã chuẩn hoá dùng trong UI ---------- */

export interface Movie {
  slug: string;
  name: string;
  originalName?: string;
  year?: string;
  description?: string;
  /** Ảnh dọc cho card (ưu tiên webp, kèm ảnh dự phòng). */
  poster?: string;
  posterFallback?: string;
  /** Ảnh ngang cho banner. */
  backdrop?: string;
  backdropFallback?: string;
  currentEpisode?: string;
  totalEpisodes?: number;
  quality?: string;
  language?: string;
  time?: string;
  director?: string;
  casts?: string;
  modified?: string;
  tmdbScore?: string;
  genres?: (TaxonomyItem | string)[];
}

export interface TaxonomyItem {
  name: string;
  /** Slug đã xác minh với API, nếu có thể liên kết. */
  slug?: string;
}

export interface Episode {
  name: string;
  slug: string;
  embed?: string;
}

export interface EpisodeServer {
  name: string;
  episodes: Episode[];
}

export interface MovieDetail extends Movie {
  formats: string[];
  genres: TaxonomyItem[];
  countries: TaxonomyItem[];
  years: string[];
  servers: EpisodeServer[];
}

export interface Paged<T> {
  items: T[];
  page: number;
  totalPages: number;
  totalItems: number;
  title?: string;
}
