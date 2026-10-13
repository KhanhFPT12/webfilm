import type { TaxonomyItem } from "../types/movie";

/**
 * Danh mục ĐÃ XÁC MINH bằng request thực tế tới
 *   /api/films/the-loai/{slug}  và  /api/films/quoc-gia/{slug}
 * (các slug trả 404 đã bị loại bỏ). API không có endpoint liệt kê danh mục,
 * nên danh sách này được duy trì thủ công.
 */

export interface Category {
  slug: string;
  name: string;
  /** Mô tả ngắn để hiển thị trên trang danh mục. */
  note?: string;
}

export const GENRES: Category[] = [
  { slug: "tinh-cam", name: "Tình cảm", note: "Những câu chuyện khiến tim rung rinh" },
  { slug: "lang-man", name: "Lãng mạn", note: "Ngọt ngào như một buổi hẹn hò" },
  { slug: "phim-hai", name: "Hài hước", note: "Cười thật to cho quên mệt mỏi" },
  { slug: "hanh-dong", name: "Hành động", note: "Gay cấn từng giây" },
  { slug: "kinh-di", name: "Kinh dị", note: "Nhớ rủ thêm một người xem cùng" },
  { slug: "hoat-hinh", name: "Hoạt hình", note: "Đáng yêu cho mọi lứa tuổi" },
  { slug: "khoa-hoc-vien-tuong", name: "Viễn tưởng", note: "Bay tới những thế giới khác" },
  { slug: "gia-tuong", name: "Giả tưởng" },
  { slug: "tam-ly", name: "Tâm lý" },
  { slug: "chinh-kich", name: "Chính kịch" },
  { slug: "gia-dinh", name: "Gia đình" },
  { slug: "co-trang", name: "Cổ trang" },
  { slug: "phieu-luu", name: "Phiêu lưu" },
  { slug: "bi-an", name: "Bí ẩn" },
  { slug: "gay-can", name: "Gây cấn" },
  { slug: "hinh-su", name: "Hình sự" },
  { slug: "lich-su", name: "Lịch sử" },
  { slug: "chien-tranh", name: "Chiến tranh" },
  { slug: "tai-lieu", name: "Tài liệu" },
  { slug: "mien-tay", name: "Miền Tây" },
];

/** 6 thể loại nổi bật trên trang chủ. */
export const FEATURED_GENRES = ["tinh-cam", "phim-hai", "hanh-dong", "kinh-di", "hoat-hinh", "khoa-hoc-vien-tuong"];

export const COUNTRIES: Category[] = [
  { slug: "han-quoc", name: "Hàn Quốc" },
  { slug: "trung-quoc", name: "Trung Quốc" },
  { slug: "nhat-ban", name: "Nhật Bản" },
  { slug: "thai-lan", name: "Thái Lan" },
  { slug: "dai-loan", name: "Đài Loan" },
  { slug: "hong-kong", name: "Hồng Kông" },
  { slug: "viet-nam", name: "Việt Nam" },
  { slug: "my", name: "Mỹ" },
  { slug: "au-my", name: "Âu Mỹ" },
  { slug: "anh", name: "Anh" },
  { slug: "phap", name: "Pháp" },
  { slug: "duc", name: "Đức" },
  { slug: "tay-ban-nha", name: "Tây Ban Nha" },
  { slug: "italy", name: "Ý" },
  { slug: "nga", name: "Nga" },
  { slug: "ba-lan", name: "Ba Lan" },
  { slug: "an-do", name: "Ấn Độ" },
  { slug: "indonesia", name: "Indonesia" },
  { slug: "uc", name: "Úc" },
  { slug: "argentina", name: "Argentina" },
];

export const LIST_TYPES = {
  "phim-le": { name: "Phim lẻ", note: "Trọn vẹn một câu chuyện cho buổi tối thư giãn" },
  "phim-bo": { name: "Phim bộ", note: "Cày dần từng tập vào cuối tuần" },
  "tv-shows": { name: "TV Shows", note: "Chương trình truyền hình giải trí" },
} as const;

export type ListType = keyof typeof LIST_TYPES;

/** Endpoint năm phát hành chấp nhận năm bất kỳ; giới hạn hợp lý cho bộ lọc. */
export const MIN_YEAR = 1970;
export const currentYear = () => new Date().getFullYear();

function normalizeName(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/gi, "d").toLowerCase().trim();
}

/** Tên thể loại trong trang chi tiết (vd "Hài", "Tình Cảm") -> slug đã xác minh. */
const GENRE_ALIASES: Record<string, string> = {
  hai: "phim-hai",
  "hai huoc": "phim-hai",
  "khoa hoc vien tuong": "khoa-hoc-vien-tuong",
  "vien tuong": "khoa-hoc-vien-tuong",
};

const COUNTRY_ALIASES: Record<string, string> = {
  "united states of america": "au-my",
  y: "italy",
  "in-do-ne-xi-a": "indonesia",
};

function lookup(name: string, list: Category[], aliases: Record<string, string>): TaxonomyItem {
  const key = normalizeName(name);
  const alias = aliases[key];
  if (alias) return { name, slug: alias };
  const found = list.find((c) => normalizeName(c.name) === key || c.slug === key.replace(/\s+/g, "-"));
  return { name, slug: found?.slug };
}

export const resolveGenre = (name: string) => lookup(name, GENRES, GENRE_ALIASES);
export const resolveCountry = (name: string) => lookup(name, COUNTRIES, COUNTRY_ALIASES);

export const findGenre = (slug?: string) => GENRES.find((g) => g.slug === slug);
export const findCountry = (slug?: string) => COUNTRIES.find((c) => c.slug === slug);
