import { Search, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { EmptyState } from "../components/common/EmptyState";
import { PageHeader } from "../components/common/PageHeader";
import { useToast } from "../components/common/Toast";
import { GRID_CLASS } from "../components/movie/MovieGrid";
import { MovieCard } from "../components/movie/MovieCard";
import { favoriteToMovie, useFavorites } from "../hooks/useFavorites";
import { useDocumentTitle } from "../hooks/useUtils";

type Sort = "recent" | "oldest" | "name" | "year";

const SORTS: { value: Sort; label: string }[] = [
  { value: "recent", label: "Mới thêm gần đây" },
  { value: "oldest", label: "Thêm lâu nhất" },
  { value: "name", label: "Tên A → Z" },
  { value: "year", label: "Năm phát hành mới nhất" },
];

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/gi, "d").toLowerCase();

export function FavoritesPage() {
  useDocumentTitle("Góc phim yêu thích");
  const { favorites, remove, clear } = useFavorites();
  const toast = useToast();
  const [sort, setSort] = useState<Sort>("recent");
  const [filter, setFilter] = useState("");

  const list = useMemo(() => {
    const q = norm(filter.trim());
    const filtered = q
      ? favorites.filter((f) => norm(f.name).includes(q) || (f.originalName && norm(f.originalName).includes(q)))
      : favorites;
    const sorted = [...filtered];
    if (sort === "recent") sorted.sort((a, b) => b.addedAt - a.addedAt);
    if (sort === "oldest") sorted.sort((a, b) => a.addedAt - b.addedAt);
    if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name, "vi"));
    if (sort === "year") sorted.sort((a, b) => Number(b.year ?? 0) - Number(a.year ?? 0));
    return sorted;
  }, [favorites, sort, filter]);

  const onClear = () => {
    if (window.confirm(`Xoá toàn bộ ${favorites.length} phim khỏi danh sách yêu thích?`)) {
      clear();
      toast.show("Đã xoá toàn bộ danh sách yêu thích");
    }
  };

  return (
    <>
      <PageHeader
        title="Góc phim của Sony"
        crumbs={[{ to: "/yeu-thich", label: "Yêu thích" }]}
        description={
          favorites.length
            ? `${favorites.length} bộ phim được lưu giữ an toàn trên trình duyệt này.`
            : "Nơi cất giữ những bộ phim bạn thương."
        }
      />

      <div className="container-page py-8 sm:py-10">
        {favorites.length === 0 ? (
          <EmptyState
            title="Chưa có bộ phim nào trong danh sách"
            description={
              <>
                Bấm vào biểu tượng trái tim ở góc mỗi poster để lưu lại những bộ phim bạn thích. Danh sách vẫn còn nguyên khi bạn tải lại trang.
              </>
            }
            action={
              <>
                <Link to="/phim-moi" className="btn-primary">
                  Khám phá phim mới
                </Link>
                <Link to="/the-loai" className="btn-secondary">
                  Xem theo thể loại
                </Link>
              </>
            }
          />
        ) : (
          <>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="relative flex-1 sm:max-w-xs">
                <span className="sr-only">Lọc theo tên</span>
                <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted" />
                <input
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="Lọc theo tên phim…"
                  className="h-9.5 w-full rounded-lg border border-line bg-surface pr-8 pl-8.5 text-xs text-ink placeholder:text-muted outline-none focus:border-deep"
                />
                {filter && (
                  <button
                    type="button"
                    onClick={() => setFilter("")}
                    aria-label="Xoá bộ lọc"
                    className="absolute top-1/2 right-2 flex size-6 -translate-y-1/2 items-center justify-center rounded text-muted hover:text-deep"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </label>
              <label className="flex items-center gap-2 text-xs text-muted">
                Sắp xếp:
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as Sort)}
                  className="h-9.5 rounded-lg border border-line bg-surface px-2.5 text-xs text-ink outline-none focus:border-deep"
                >
                  {SORTS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                onClick={onClear}
                className="btn-ghost h-9 px-3 text-xs text-muted hover:text-deep sm:ml-auto"
              >
                <Trash2 className="size-3.5" /> Xoá tất cả
              </button>
            </div>

            {list.length === 0 ? (
              <EmptyState title="Không có phim nào khớp bộ lọc" description={`Không tìm thấy “${filter}” trong danh sách yêu thích.`} />
            ) : (
              <div className={GRID_CLASS}>
                {list.map((f) => (
                  <div key={f.slug} className="flex flex-col">
                    <MovieCard movie={favoriteToMovie(f)} />
                    <button
                      type="button"
                      onClick={() => {
                        remove(f.slug);
                        toast.show(`Đã bỏ “${f.name}” khỏi danh sách`);
                      }}
                      className="mt-1.5 inline-flex items-center gap-1 self-start rounded px-1 py-0.5 text-[11px] font-medium text-muted hover:text-deep"
                    >
                      <X className="size-3" /> Xoá khỏi danh sách
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
