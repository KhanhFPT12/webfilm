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
        title="Lịch sử xem"
        crumbs={[{ to: "/lich-su", label: "Lịch sử xem" }]}
        description={`Lưu tối đa ${MAX_HISTORY} phim gần nhất cùng tập bạn đang xem, ngay trên trình duyệt này.`}
      />

      <div className="container-page py-8 sm:py-10">
        {history.length === 0 ? (
          <EmptyState
            title="Bạn chưa xem phim nào"
            description="Khi bạn mở một bộ phim, rạp hồng sẽ nhớ tập đang xem để lần sau bạn xem tiếp chỉ với một chạm."
            action={
              <Link to="/" className="btn-primary">
                Chọn phim đầu tiên
              </Link>
            }
          />
        ) : (
          <>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted">{history.length} phim đã xem</p>
              <button type="button" onClick={onClear} className="btn-ghost text-deep">
                <Trash2 className="size-4" /> Xoá toàn bộ lịch sử
              </button>
            </div>

            <ul className="grid gap-3 md:grid-cols-2">
              {history.map((h) => {
                const resume = h.episodeSlug ? watchUrl(h.slug, h.episodeSlug, h.serverIndex ?? 0) : `/xem-phim/${h.slug}`;
                return (
                  <li
                    key={h.slug}
                    className="flex gap-3.5 rounded-xl border border-line bg-surface p-3 shadow-[var(--shadow-card)] sm:gap-4"
                  >
                    <Link
                      to={`/phim/${h.slug}`}
                      className="relative h-28 w-[75px] shrink-0 overflow-hidden rounded-lg sm:h-32 sm:w-[86px]"
                      tabIndex={-1}
                      aria-hidden="true"
                    >
                      <PosterImage src={h.poster} fallback={h.posterFallback} alt="" className="size-full" />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <Link to={`/phim/${h.slug}`} className="line-clamp-2 rounded font-semibold text-ink hover:text-deep">
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
                          className="btn-icon -mt-1 -mr-1 size-8 shrink-0 text-muted"
                          aria-label={`Xoá ${h.name} khỏi lịch sử`}
                          title="Xoá khỏi lịch sử"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                      <p className="mt-1.5 text-sm">
                        {h.episodeName && (
                          <span className="font-semibold text-deep">
                            {episodeLabel(h.episodeName)}
                            {h.totalEpisodes && h.totalEpisodes > 1 ? (
                              <span className="font-normal text-muted"> / {h.totalEpisodes} tập</span>
                            ) : null}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted" title={formatDateTime(h.watchedAt)}>
                        Xem {timeAgo(h.watchedAt).toLowerCase()} · {formatDateTime(h.watchedAt)}
                      </p>
                      <div className="mt-auto pt-2">
                        <Link to={resume} className="btn-primary h-9 px-3.5 text-[13px]">
                          <Play className="size-3.5 fill-white" /> Tiếp tục xem
                        </Link>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <p className="mt-6 flex items-start gap-2 text-xs text-muted">
              <InfoIcon className="mt-0.5 size-3.5 shrink-0" />
              Trình phát được nhúng từ nhà cung cấp nguồn phim (khác tên miền) nên trình duyệt không cho phép đọc mốc thời gian đang xem.
              Rạp hồng lưu tập và server bạn đang xem để tiếp tục.
            </p>
          </>
        )}
      </div>
    </>
  );
}
