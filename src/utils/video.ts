/**
 * Phân loại URL nguồn phát.
 *
 * Kết quả kiểm tra API NguonC (13/10/2026): mỗi tập chỉ có trường `embed`,
 * là URL trang trình phát của nhà cung cấp (vd https://embed18.streamc.xyz/embed.php?hash=...).
 * Không có link .m3u8/.mp4 trực tiếp. Vì vậy:
 *   - `embed`  -> nhúng bằng <iframe> (đúng mục đích nhà cung cấp đưa ra)
 *   - `.m3u8`  -> HLS (hls.js / Safari native) — chỉ dùng nếu API trả về
 *   - `.mp4`…  -> <video> HTML5 — chỉ dùng nếu API trả về
 */
export type SourceKind = "hls" | "file" | "embed" | "invalid";

export interface VideoSource {
  kind: SourceKind;
  url: string;
}

export function classifySource(url?: string): VideoSource {
  if (!url) return { kind: "invalid", url: "" };
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { kind: "invalid", url };
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return { kind: "invalid", url };

  const path = parsed.pathname.toLowerCase();
  if (path.endsWith(".m3u8")) return { kind: "hls", url };
  if (/\.(mp4|webm|ogg|ogv|mov)$/.test(path)) return { kind: "file", url };
  return { kind: "embed", url };
}
