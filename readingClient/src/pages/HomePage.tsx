import { useEffect, useState } from "react";
import { NovelDTO } from "../types/novel.types";
import { handleApiError, ErrorState } from "../utils/handleApiError";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";
import { NovelCard } from "../components/NovelCard";
import { Pagination } from "../components/Pagination";
import { mockNovels } from "../mock/novels.mock";
import { useMockFallback } from "../utils/useMockFallback";
import { getNovelsByPage } from "../services/api";

export const HomePage = () => {
  const [novels, setNovels] = useState<NovelDTO[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);
  const [search, setSearch] = useState("");

  const fetchNovels = async (page: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getNovelsByPage(page, 20);
      setNovels(response.data.content);
      setTotalPages(response.data.totalPages);

      // If database has no data, use mock data
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

  useEffect(() => {
    fetchNovels(page);
  }, [page]);

  const filteredNovels = novels.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-3xl font-bold text-deep-space-blue-800 mb-6">
        Browse Novels
      </h1>

      <input
        type="text"
        placeholder="Search by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-ocean-blue-500 mb-6"
      />

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage error={error} />}

      {!loading && (
        <>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
  );
};