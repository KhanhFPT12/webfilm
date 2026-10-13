import { AlertTriangle, Loader2, Maximize, Minimize, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { classifySource } from "../../utils/video";

interface Props {
  url?: string;
  title: string;
}

type Status = "loading" | "ready" | "slow" | "error";

/** Sau thời gian này mà iframe chưa tải xong thì gợi ý thử lại / mở tab mới. */
const EMBED_SLOW_MS = 20_000;

export function VideoPlayer({ url, title }: Props) {
  const source = classifySource(url);
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<Status>("loading");
  const [errorText, setErrorText] = useState("");
  const [fullscreen, setFullscreen] = useState(false);

  const retry = useCallback(() => setAttempt((a) => a + 1), []);

  // Reset khi đổi nguồn / thử lại.
  useEffect(() => {
    setStatus(source.kind === "invalid" ? "error" : "loading");
    setErrorText("");
  }, [source.url, source.kind, attempt]);

  // Iframe: không đọc được lỗi cross-origin, nên dùng onLoad + mốc thời gian.
  useEffect(() => {
    if (source.kind !== "embed") return;
    const t = setTimeout(() => setStatus((s) => (s === "loading" ? "slow" : s)), EMBED_SLOW_MS);
    return () => clearTimeout(t);
  }, [source.kind, source.url, attempt]);

  // HLS: hls.js (tải động) hoặc Safari native.
  useEffect(() => {
    if (source.kind !== "hls") return;
    const video = videoRef.current;
    if (!video) return;
    let destroyed = false;
    let hls: { destroy: () => void } | undefined;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source.url;
    } else {
      import("hls.js")
        .then(({ default: Hls }) => {
          if (destroyed) return;
          if (!Hls.isSupported()) {
            setStatus("error");
            setErrorText("Trình duyệt này không hỗ trợ phát luồng HLS.");
            return;
          }
          const instance = new Hls({ enableWorker: true });
          hls = instance;
          instance.on(Hls.Events.ERROR, (_e, data) => {
            if (data.fatal) {
              setStatus("error");
              setErrorText("Không tải được luồng phát (HLS). Nguồn có thể đã hết hạn hoặc bị chặn.");
              instance.destroy();
            }
          });
          instance.loadSource(source.url);
          instance.attachMedia(video);
        })
        .catch(() => {
          setStatus("error");
          setErrorText("Không tải được thư viện phát HLS.");
        });
    }
    return () => {
      destroyed = true;
      hls?.destroy();
      video.removeAttribute("src");
      video.load();
    };
  }, [source.kind, source.url, attempt]);

  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === wrapRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = async () => {
    const el = wrapRef.current;
    if (!el) return;
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await el.requestFullscreen();
    } catch {
      /* iOS Safari không hỗ trợ fullscreen cho div — dùng nút fullscreen trong trình phát. */
    }
  };

  const canFullscreen = typeof document !== "undefined" && !!document.fullscreenEnabled;

  return (
    <div>
      <div
        ref={wrapRef}
        className="relative aspect-video w-full overflow-hidden rounded-xl bg-black ring-1 ring-plum-700 [&:fullscreen]:rounded-none"
      >
        {source.kind === "embed" && (
          <iframe
            key={`${source.url}#${attempt}`}
            src={source.url}
            title={`Trình phát: ${title}`}
            className="absolute inset-0 size-full border-0"
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
            // Chặn quảng cáo popup / chuyển hướng: không cấp allow-popups và allow-top-navigation,
            // nên bấm vào trình phát chỉ phát phim, không mở tab mới hay đổi trang.
            sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
            onLoad={() => setStatus("ready")}
          />
        )}

        {(source.kind === "hls" || source.kind === "file") && (
          <video
            key={`${source.url}#${attempt}`}
            ref={videoRef}
            src={source.kind === "file" ? source.url : undefined}
            className="absolute inset-0 size-full bg-black"
            controls
            playsInline
            preload="metadata"
            onLoadedData={() => setStatus("ready")}
            onCanPlay={() => setStatus("ready")}
            onError={() => {
              setStatus("error");
              setErrorText("Không phát được tệp video này. Nguồn có thể đã bị gỡ hoặc định dạng không được hỗ trợ.");
            }}
          />
        )}

        {status === "loading" && source.kind !== "invalid" && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 bg-plum-950 text-plum-300">
            <Loader2 className="size-9 animate-spin text-rose" />
            <p className="text-sm">Đang chuẩn bị màn chiếu…</p>
          </div>
        )}

        {status === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-plum-950 px-6 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-plum-800 text-rose">
              <AlertTriangle className="size-6" />
            </span>
            <p className="font-semibold text-white">Không phát được tập này</p>
            <p className="max-w-md text-sm text-plum-300">
              {source.kind === "invalid" ? "API không cung cấp nguồn phát hợp lệ cho tập này. Hãy thử server hoặc tập khác." : errorText}
            </p>
            {source.kind !== "invalid" && (
              <button type="button" className="btn-primary" onClick={retry}>
                <RotateCcw className="size-4" /> Thử lại
              </button>
            )}
          </div>
        )}
      </div>

      {/* Thanh công cụ dưới trình phát */}
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm">
        <p className="text-plum-300" aria-live="polite">
          {status === "slow" ? (
            <span className="inline-flex items-center gap-1.5 text-amber-200">
              <AlertTriangle className="size-4" /> Nguồn phát phản hồi chậm. Bạn hãy bấm “Tải lại” hoặc thử server khác.
            </span>
          ) : source.kind === "embed" ? (
            "Đã chặn quảng cáo popup. Quảng cáo video trong trình phát do nhà cung cấp chèn."
          ) : null}
        </p>
        <div className="flex items-center gap-1">
          {source.kind !== "invalid" && (
            <button type="button" onClick={retry} className="btn h-9 px-3 text-plum-300 hover:bg-plum-800 hover:text-white">
              <RotateCcw className="size-4" /> Tải lại
            </button>
          )}
          {canFullscreen && source.kind !== "invalid" && (
            <button
              type="button"
              onClick={toggleFullscreen}
              className="btn h-9 px-3 text-plum-300 hover:bg-plum-800 hover:text-white"
              aria-label={fullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
            >
              {fullscreen ? <Minimize className="size-4" /> : <Maximize className="size-4" />}
              <span className="hidden sm:inline">{fullscreen ? "Thu nhỏ" : "Toàn màn hình"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
