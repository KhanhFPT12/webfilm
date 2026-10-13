export const API_BASE = "https://phim.nguonc.com/api";

const DEFAULT_TIMEOUT = 15_000;
const CACHE_TTL = 5 * 60_000;
const CACHE_MAX = 120;

export type ApiErrorKind = "http" | "notfound" | "timeout" | "network" | "parse" | "api";

export class ApiError extends Error {
  kind: ApiErrorKind;
  status?: number;

  constructor(kind: ApiErrorKind, message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.kind = kind;
    this.status = status;
  }
}

export function describeError(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return "Đã có lỗi không xác định xảy ra.";
}

interface CacheEntry {
  at: number;
  data: unknown;
}

const cache = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<unknown>>();

function remember(key: string, data: unknown) {
  if (cache.size >= CACHE_MAX) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  cache.set(key, { at: Date.now(), data });
}

async function request<T>(url: string, timeout: number): Promise<T> {
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    throw new ApiError("network", "Bạn đang ngoại tuyến. Hãy kiểm tra kết nối mạng rồi thử lại.");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
  } catch (err) {
    if ((err as Error)?.name === "AbortError") {
      throw new ApiError("timeout", "Máy chủ phim phản hồi quá lâu. Vui lòng thử lại.");
    }
    throw new ApiError("network", "Không thể kết nối tới máy chủ phim. Hãy kiểm tra mạng và thử lại.");
  } finally {
    clearTimeout(timer);
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    if (!response.ok) {
      throw new ApiError("http", `Máy chủ trả về lỗi HTTP ${response.status}.`, response.status);
    }
    throw new ApiError("parse", "Dữ liệu nhận được không hợp lệ (không phải JSON).");
  }

  const apiMessage = body && typeof body === "object" && "message" in body ? String((body as { message: unknown }).message) : "";

  if (!response.ok) {
    if (response.status === 404) {
      throw new ApiError("notfound", "Không tìm thấy nội dung bạn yêu cầu.", 404);
    }
    throw new ApiError("http", `Máy chủ trả về lỗi HTTP ${response.status}${apiMessage ? `: ${apiMessage}` : "."}`, response.status);
  }

  if (body && typeof body === "object" && (body as { status?: string }).status === "error") {
    throw new ApiError("api", apiMessage || "Máy chủ phim báo lỗi.");
  }

  return body as T;
}

/**
 * GET JSON có timeout, cache trong bộ nhớ (TTL 5 phút) và gộp các request
 * trùng nhau đang chạy song song thành một.
 */
export function getJson<T>(path: string, opts: { force?: boolean; timeout?: number } = {}): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;

  if (!opts.force) {
    const hit = cache.get(url);
    if (hit && Date.now() - hit.at < CACHE_TTL) return Promise.resolve(hit.data as T);
    const pending = inflight.get(url);
    if (pending) return pending as Promise<T>;
  }

  const promise = request<T>(url, opts.timeout ?? DEFAULT_TIMEOUT)
    .then((data) => {
      remember(url, data);
      return data;
    })
    .finally(() => {
      inflight.delete(url);
    });

  inflight.set(url, promise);
  return promise;
}
