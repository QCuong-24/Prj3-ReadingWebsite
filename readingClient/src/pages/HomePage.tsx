import { useEffect, useState } from "react";
import { NovelDTO, StatisticDTO } from "../types/novel.types";
import { handleApiError, ErrorState } from "../utils/handleApiError";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";
import { NovelCard } from "../components/NovelCard";
import { Pagination } from "../components/Pagination";
import { mockNovels } from "../mock/novels.mock";
import { useMockFallback } from "../utils/useMockFallback";
import { getNovelsByPage } from "../services/api";
import { getTopViewedByMonth } from "../services/statistic.api";
import { TopViewedSlider } from "../components/TopViewedSlider";
import { TopViewedTable } from "../components/TopViewedTable";

export const HomePage = () => {
  const [novels, setNovels] = useState<NovelDTO[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);
  const [search, setSearch] = useState("");

  const [topNovels, setTopNovels] = useState<StatisticDTO[]>([]);

  const fetchNovels = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getNovelsByPage(page, 9);
      const data = response.data;
      const novelsData = data.content ?? data;
      setNovels(useMockFallback(novelsData, mockNovels));
      setTotalPages(data.totalPages ?? 1);
    } catch (err) {
      setNovels(mockNovels);
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const fetchTopNovels = async () => {
    try {
      const res = await getTopViewedByMonth(new Date().getMonth() + 1, new Date().getFullYear(), 5);
      setTopNovels(res.data);
      console.log("Top novels:", res.data);
    } catch (err) {
      console.error("Failed to fetch top novels", err);
    }
  };

  useEffect(() => {
    fetchNovels(page);
  }, [page]);

  useEffect(() => {
    fetchTopNovels();
  }, []);

  const filteredNovels = novels.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Top Novels Slider */}
      <TopViewedSlider novels={topNovels} />

      {/* Main content: 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Novels list */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold text-deep-space-blue-800 mb-6">
            Browse Novels
          </h1>

          <input
            type="text"
            placeholder="Filter by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-ocean-blue-500 mb-6"
          />

          {loading && <LoadingSpinner />}
          {error && <ErrorMessage error={error} />}

          {!loading && (
            <>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                {filteredNovels.map((novel) => (
                  <NovelCard key={novel.id} novel={novel} />
                ))}
              </div>

              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          )}
        </div>

        {/* Right column: Top viewed table */}
        <TopViewedTable />

      </div>
    </div>
  );
};