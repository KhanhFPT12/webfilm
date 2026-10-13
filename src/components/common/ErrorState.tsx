import { CloudOff, RotateCcw, SearchX, WifiOff } from "lucide-react";
import { Link } from "react-router-dom";
import { ApiError, describeError } from "../../api/client";

interface Props {
  error: unknown;
  onRetry?: () => void;
  title?: string;
  compact?: boolean;
  tone?: "light" | "dark";
}

export function ErrorState({ error, onRetry, title, compact = false, tone = "light" }: Props) {
  const kind = error instanceof ApiError ? error.kind : undefined;
  const Icon = kind === "network" ? WifiOff : kind === "notfound" ? SearchX : CloudOff;
  const dark = tone === "dark";
  const heading =
    title ?? (kind === "notfound" ? "Không tìm thấy nội dung" : kind === "network" ? "Mất kết nối rồi" : "Ối, rạp hồng gặp chút trục trặc");

  return (
    <div
      role="alert"
      className={`flex flex-col items-center rounded-xl border text-center ${
        dark ? "border-plum-700 bg-plum-900 text-pastel" : "border-line bg-white"
      } ${compact ? "gap-2 px-4 py-6" : "gap-3 px-6 py-12"}`}
    >
      <span className={`flex size-12 items-center justify-center rounded-full ${dark ? "bg-plum-800 text-rose" : "bg-pastel text-deep"}`}>
        <Icon className="size-6" />
      </span>
      <h3 className={`font-semibold ${dark ? "text-white" : "text-ink"}`}>{heading}</h3>
      <p className={`max-w-md text-sm ${dark ? "text-plum-300" : "text-muted"}`}>{describeError(error)}</p>
      <div className="mt-1 flex flex-wrap justify-center gap-2">
        {onRetry && kind !== "notfound" && (
          <button type="button" onClick={onRetry} className="btn-primary">
            <RotateCcw className="size-4" /> Thử tải lại
          </button>
        )}
        {kind === "notfound" && (
          <Link to="/" className="btn-primary">
            Về trang chủ
          </Link>
        )}
      </div>
    </div>
  );
}
