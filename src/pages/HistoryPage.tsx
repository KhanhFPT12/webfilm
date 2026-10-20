import { Info as InfoIcon, Play, Trash2, X } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyState } from "../components/common/EmptyState";
import { PageHeader } from "../components/common/PageHeader";
import { PosterImage } from "../components/common/PosterImage";
import { useToast } from "../components/common/Toast";
import { watchUrl } from "../components/movie/EpisodeList";
import { useDocumentTitle } from "../hooks/useUtils";
import { MAX_HISTORY, useWatchHistory } from "../hooks/useWatchHistory";
import { episodeLabel, formatDateTime, timeAgo } from "../utils/formatters";

export function HistoryPage() {
  useDocumentTitle("Lịch sử xem");
  const { history, remove, clear } = useWatchHistory();
  const toast = useToast();

  const onClear = () => {
    if (window.confirm("Xoá toàn bộ lịch sử xem?")) {
      clear();
      toast.show("Đã xoá toàn bộ lịch sử xem");
    }
  };

  return (
    <>
      <PageHeader
        title="Lịch sử xem phim"
        crumbs={[{ to: "/lich-su", label: "Lịch sử xem" }]}
        description={`Lưu tối đa ${MAX_HISTORY} bộ phim gần nhất cùng tập phim bạn đang theo dõi.`}
      />

      <div className="container-page py-8 sm:py-10">
        {history.length === 0 ? (
          <EmptyState
            title="Bạn chưa xem bộ phim nào"
            description="Khi bạn mở xem một bộ phim, hệ thống sẽ tự động lưu lại tập đang xem để lần sau bạn tiếp tục một cách nhanh chóng."
            action={
              <Link to="/" className="btn-primary">
                Chọn phim đầu tiên
              </Link>
            }
          />
        ) : (
          <>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-muted">{history.length} phim đã xem</p>
              <button type="button" onClick={onClear} className="btn-ghost h-8 px-2.5 text-xs text-muted hover:text-deep">
                <Trash2 className="size-3.5" /> Xoá toàn bộ lịch sử
              </button>
            </div>

            <ul className="grid gap-3.5 md:grid-cols-2">
              {history.map((h) => {
                const resume = h.episodeSlug ? watchUrl(h.slug, h.episodeSlug, h.serverIndex ?? 0) : `/xem-phim/${h.slug}`;
                return (
                  <li
                    key={h.slug}
                    className="flex gap-3.5 rounded-xl border border-line bg-surface p-3 shadow-xs transition-all duration-150 hover:border-deep/30 sm:gap-4"
                  >
                    <Link
                      to={`/phim/${h.slug}`}
                      className="relative h-28 w-[72px] shrink-0 overflow-hidden rounded-lg border border-line bg-sub sm:h-30 sm:w-[80px]"
                      tabIndex={-1}
                      aria-hidden="true"
                    >
                      <PosterImage src={h.poster} fallback={h.posterFallback} alt="" className="size-full" />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <Link to={`/phim/${h.slug}`} className="line-clamp-1 text-sm font-semibold text-ink hover:text-deep">
                            {h.name}
                          </Link>
                          {h.originalName && <p className="truncate text-xs text-muted">{h.originalName}</p>}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            remove(h.slug);
                            toast.show("Đã xoá khỏi lịch sử");
                          }}
                          className="flex size-7 shrink-0 items-center justify-center rounded text-muted hover:text-deep"
                          aria-label={`Xoá ${h.name} khỏi lịch sử`}
                          title="Xoá khỏi lịch sử"
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                      <p className="mt-1 text-xs">
                        {h.episodeName && (
                          <span className="font-semibold text-deep">
                            {episodeLabel(h.episodeName)}
                            {h.totalEpisodes && h.totalEpisodes > 1 ? (
                              <span className="font-normal text-muted"> / {h.totalEpisodes} tập</span>
                            ) : null}
                          </span>
                        )}
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted" title={formatDateTime(h.watchedAt)}>
                        Xem {timeAgo(h.watchedAt).toLowerCase()} · {formatDateTime(h.watchedAt)}
                      </p>
                      <div className="mt-auto pt-2">
                        <Link to={resume} className="btn-primary h-8 px-3 text-xs">
                          <Play className="size-3 fill-white" /> Tiếp tục xem
                        </Link>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <p className="mt-6 flex items-start gap-2 text-xs text-muted">
              <InfoIcon className="mt-0.5 size-3.5 shrink-0" />
              Lịch sử được lưu trực tiếp trên thiết bị của bạn để bạn có thể xem tiếp tập phim đang dở bất kỳ lúc nào.
            </p>
          </>
        )}
      </div>
    </>
  );
}
