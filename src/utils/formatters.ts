/** Bỏ thẻ HTML, entity phổ biến và khoảng trắng thừa trong dữ liệu API. */
export function cleanText(input: string): string {
  return input
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export function truncate(text: string | undefined, max: number): string | undefined {
  if (!text) return text;
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const space = cut.lastIndexOf(" ");
  return `${cut.slice(0, space > max * 0.6 ? space : max).trim()}…`;
}

/** Tách danh sách diễn viên/đạo diễn "A, B, C". */
export function splitPeople(value?: string): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s && !/^(đang cập nhật|updating|n\/a)$/i.test(s));
}

/** Hiển thị tên tập: "1" -> "Tập 1", "FULL" -> "Full". */
export function episodeLabel(name: string): string {
  if (/^\d+$/.test(name)) return `Tập ${name}`;
  if (/^full$/i.test(name)) return "Full";
  return name;
}

/** Phim bộ hay phim lẻ dựa trên dữ liệu thực (số tập / định dạng). */
export function isSeries(m: { totalEpisodes?: number; formats?: string[] }): boolean {
  if (m.formats?.some((f) => /phim bộ|tv show/i.test(f))) return true;
  if (m.formats?.some((f) => /phim lẻ/i.test(f))) return false;
  return (m.totalEpisodes ?? 1) > 1;
}

const rtf = typeof Intl !== "undefined" ? new Intl.RelativeTimeFormat("vi", { numeric: "auto" }) : null;

export function timeAgo(timestamp: number): string {
  const diff = (timestamp - Date.now()) / 1000;
  const abs = Math.abs(diff);
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [unit, secs] of units) {
    if (abs >= secs) return rtf ? rtf.format(Math.round(diff / secs), unit) : new Date(timestamp).toLocaleString("vi");
  }
  return "Vừa xong";
}

export function formatDateTime(timestamp: number): string {
  return new Date(timestamp).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatNumber(n: number): string {
  return n.toLocaleString("vi-VN");
}
