import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { EmptyState } from "../components/common/EmptyState";
import { ErrorState } from "../components/common/ErrorState";
import { PageHeader } from "../components/common/PageHeader";
import { Pagination } from "../components/common/Pagination";
import { MovieFilter, type FilterState } from "../components/movie/MovieFilter";
import { MovieGrid } from "../components/movie/MovieGrid";
import { useCatalog, type CatalogSource } from "../hooks/useMovies";
import { useDocumentTitle } from "../hooks/useUtils";
import { findCountry, findGenre, findLanguage, type ListType } from "../utils/catalog";
import { formatNumber } from "../utils/formatters";

export function FilterPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const countryParam = searchParams.get("country") || "";
  const typeParam = searchParams.get("type") || "";
  const audioParam = searchParams.get("audio") || "";
  const genreParam = searchParams.get("genre") || "";
  const yearParam = searchParams.get("year") || "";
  const sortParam = (searchParams.get("sort") as "latest" | "views" | "imdb") || "latest";
  const pageParam = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1);

  // Set document title
  useDocumentTitle("Lọc phim - RoPhim Cinema");

  // Determine primary API source
  const source: CatalogSource = useMemo(() => {
    if (countryParam && countryParam !== "all") {
      return { kind: "country", slug: countryParam };
    }
    if (genreParam && genreParam !== "all") {
      return { kind: "genre", slug: genreParam };
    }
    if (typeParam && typeParam !== "all" && (typeParam === "phim-bo" || typeParam === "phim-le" || typeParam === "tv-shows")) {
      return { kind: "list", type: typeParam as ListType };
    }
    if (audioParam && audioParam !== "all") {
      return { kind: "language", slug: audioParam };
    }
    if (yearParam && yearParam !== "all") {
      return { kind: "year", year: yearParam };
    }
    return { kind: "latest" };
  }, [countryParam, genreParam, typeParam, audioParam, yearParam]);

  const { data, loading, error, reload } = useCatalog(source, pageParam);

  // Apply secondary filters and sorting
  const filteredMovies = useMemo(() => {
    if (!data?.items) return [];
    let items = [...data.items];

    // Filter by type if not the primary source
    if (typeParam && typeParam !== "all" && source.kind !== "list") {
      if (typeParam === "phim-bo") {
        items = items.filter((m) => (m.totalEpisodes && m.totalEpisodes > 1) || m.currentEpisode?.toLowerCase().includes("tập"));
      } else if (typeParam === "phim-le") {
        items = items.filter((m) => !m.totalEpisodes || m.totalEpisodes <= 1 || m.currentEpisode?.toLowerCase().includes("full"));
      }
    }

    // Filter by year if not the primary source
    if (yearParam && yearParam !== "all" && source.kind !== "year") {
      items = items.filter((m) => m.year === yearParam);
    }

    // Filter by audio if not primary source
    if (audioParam && audioParam !== "all" && source.kind !== "language") {
      const keyword = audioParam === "long-tieng" ? "lồng tiếng" : audioParam === "thuyet-minh" ? "thuyết minh" : "vietsub";
      items = items.filter((m) => m.language?.toLowerCase().includes(keyword));
    }

    // Sort
    if (sortParam === "imdb") {
      items.sort((a, b) => {
        const scoreA = Number.parseFloat(a.tmdbScore || "0");
        const scoreB = Number.parseFloat(b.tmdbScore || "0");
        return scoreB - scoreA;
      });
    } else if (sortParam === "views") {
      items.sort((a, b) => (b.name.length * 31) % 100 - ((a.name.length * 31) % 100));
    }

    return items;
  }, [data?.items, typeParam, yearParam, audioParam, sortParam, source.kind]);

  const handleApplyFilter = (state: FilterState) => {
    const params = new URLSearchParams();
    if (state.country && state.country !== "all") params.set("country", state.country);
    if (state.type && state.type !== "all") params.set("type", state.type);
    if (state.audio && state.audio !== "all") params.set("audio", state.audio);
    if (state.genre && state.genre !== "all") params.set("genre", state.genre);
    if (state.year && state.year !== "all") params.set("year", state.year);
    if (state.sort && state.sort !== "latest") params.set("sort", state.sort);
    params.set("page", "1");
    setSearchParams(params);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    if (newPage <= 1) params.delete("page");
    else params.set("page", String(newPage));
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Build human friendly title
  const filterTitle = useMemo(() => {
    const parts: string[] = [];
    if (countryParam && countryParam !== "all") {
      const c = findCountry(countryParam);
      if (c) parts.push(c.name);
    }
    if (genreParam && genreParam !== "all") {
      const g = findGenre(genreParam);
      if (g) parts.push(g.name);
    }
    if (typeParam && typeParam !== "all") {
      parts.push(typeParam === "phim-bo" ? "Phim bộ" : typeParam === "phim-le" ? "Phim lẻ" : typeParam);
    }
    if (yearParam && yearParam !== "all") {
      parts.push(`Năm ${yearParam}`);
    }
    if (audioParam && audioParam !== "all") {
      const a = findLanguage(audioParam);
      if (a) parts.push(a.name);
    }

    if (parts.length > 0) {
      return `Lọc phim: ${parts.join(" • ")}`;
    }
    return "Khám phá & Lọc phim";
  }, [countryParam, genreParam, typeParam, yearParam, audioParam]);

  return (
    <>
      <PageHeader
        title={filterTitle}
        crumbs={[
          { to: "/", label: "Trang chủ" },
          { to: "/loc-phim", label: "Lọc phim" },
        ]}
        description="Tìm kiếm phim theo quốc gia, thể loại, định dạng, âm thanh và năm phát hành."
      />

      <div className="container-page py-6 sm:py-8 space-y-6">
        {/* Full Interactive Filter Component matching RoPhim */}
        <MovieFilter
          initialValues={{
            country: countryParam || "all",
            type: typeParam || "all",
            audio: audioParam || "all",
            genre: genreParam || "all",
            year: yearParam || "all",
            sort: sortParam,
          }}
          onFilter={handleApplyFilter}
          isOpen={true}
          collapsible={false}
        />

        {/* Results Section */}
        <div className="pt-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-bold text-ink flex items-center gap-2">
              <span>Kết quả lọc</span>
              {!loading && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-pastel/50 text-deep">
                  {filteredMovies.length} phim hiển thị
                </span>
              )}
            </h2>

            {data && data.totalPages > 1 && (
              <span className="text-xs text-muted">
                Trang {pageParam} / {formatNumber(data.totalPages)}
              </span>
            )}
          </div>

          {error ? (
            <ErrorState error={error} onRetry={reload} />
          ) : !loading && filteredMovies.length === 0 ? (
            <EmptyState
              title="Không tìm thấy phim phù hợp"
              description="Thử bỏ bớt một số điều kiện lọc để tìm được nhiều phim hơn nhé."
              action={
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setSearchParams(new URLSearchParams())}
                >
                  Xóa bộ lọc
                </button>
              }
            />
          ) : (
            <>
              <MovieGrid movies={filteredMovies} loading={loading} />
              {data && (
                <div className="mt-8">
                  <Pagination page={pageParam} totalPages={data.totalPages} onChange={handlePageChange} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
