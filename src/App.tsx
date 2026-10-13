import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { CategoryPage } from "./pages/CategoryPage";
import { FavoritesPage } from "./pages/FavoritesPage";
import { HistoryPage } from "./pages/HistoryPage";
import { HomePage } from "./pages/HomePage";
import { InfoPage } from "./pages/InfoPage";
import { MovieDetailPage } from "./pages/MovieDetailPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { SearchPage } from "./pages/SearchPage";
import { TaxonomyPage } from "./pages/TaxonomyPage";
import { WatchPage } from "./pages/WatchPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="tim-kiem" element={<SearchPage />} />
        <Route path="phim-moi" element={<CategoryPage key="latest" mode="latest" />} />
        <Route path="phim-le" element={<CategoryPage key="phim-le" mode="list" listType="phim-le" />} />
        <Route path="phim-bo" element={<CategoryPage key="phim-bo" mode="list" listType="phim-bo" />} />
        <Route path="tv-shows" element={<CategoryPage key="tv-shows" mode="list" listType="tv-shows" />} />
        <Route path="the-loai" element={<TaxonomyPage kind="genre" />} />
        <Route path="the-loai/:slug" element={<CategoryPage mode="genre" />} />
        <Route path="quoc-gia" element={<TaxonomyPage kind="country" />} />
        <Route path="quoc-gia/:slug" element={<CategoryPage mode="country" />} />
        <Route path="nam/:year" element={<CategoryPage mode="year" />} />
        <Route path="phim/:slug" element={<MovieDetailPage />} />
        <Route path="xem-phim/:slug" element={<WatchPage />} />
        <Route path="yeu-thich" element={<FavoritesPage />} />
        <Route path="lich-su" element={<HistoryPage />} />
        <Route path="thong-tin/:page" element={<InfoPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
