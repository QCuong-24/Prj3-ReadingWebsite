import { useEffect, useState } from "react";
import { NovelSearchResult, ChapterSearchResult, SearchResult } from "../types/search.types";
import { handleApiError, ErrorState } from "../utils/handleApiError";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";
import { NovelCard } from "../components/NovelCard";
import { Pagination } from "../components/Pagination";
import { searchNovels, searchChapters } from "../services/api";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"novels" | "chapters">("novels");
  const [results, setResults] = useState<NovelSearchResult[] | ChapterSearchResult[]>([]);
  const [resultType, setResultType] = useState<"novels" | "chapters">("novels");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);
  const navigate = useNavigate();

  const fetchResults = async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let response;
      if (type === "novels") {
        response = await searchNovels(query, page);
        console.log("API Response for novels:", response);
        setResultType("novels");
      } else {
        response = await searchChapters(query, page);
        setResultType("chapters");
      }

      const data: SearchResult<any> = response.data;
      setResults(data.items); // backend trả về items
      setTotalPages(data.totalPages ?? 1);
      // setPage(data.currentPage ?? 0);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
  };

  // Trigger fetch when page changes
  useEffect(() => {
    // Only fetch if there's a query, otherwise it might call API on initial load
    if (query.trim()) {
      fetchResults();
    }
  }, [page]); // Re-run this function whenever 'page' changes

  return (
    <div>
      <h1 className="text-3xl font-bold text-deep-space-blue-800 mb-6">Search</h1>

      {/* Search Input with icons */}
      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Enter keyword..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") fetchResults();
            }}
            className="w-full p-3 pr-10 border rounded-lg focus:ring-2 focus:ring-ocean-blue-500"
          />
          {/* Clear button */}
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Search button */}
        <button
          onClick={() => {setPage(0); fetchResults();}}
          className="p-3 bg-ocean-blue-500 hover:bg-ocean-blue-600 text-white rounded-lg flex items-center justify-center"
        >
          <Search size={20} />
        </button>

        <select
          value={type}
          onChange={(e) => setType(e.target.value as "novels" | "chapters")}
          className="p-3 border rounded-lg"
        >
          <option value="novels">Novels</option>
          <option value="chapters">Chapters</option>
        </select>
      </div>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage error={error} />}

      {!loading && results.length > 0 && (
        <>
          {resultType === "novels" ? (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {(results as NovelSearchResult[]).map((novel) => (
                <NovelCard 
                  key={novel.novelId} 
                  novel={{
                    ...novel,
                    id: novel.novelId // This creates the 'id' property that NovelCard needs
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {(results as ChapterSearchResult[]).map((chapter) => (
                <div
                  key={chapter.chapterId}
                  onClick={() => navigate(`/novel/${chapter.novelId}/chapter/${chapter.chapterId}`)}
                  className="group p-4 border rounded-lg hover:bg-ocean-blue-50 transition-all cursor-pointer shadow-sm hover:shadow-md border-gray-200 hover:border-ocean-blue-300"
                >
                  {/* Novel Title - Clickable separately */}
                  <div className="flex items-center gap-2 mb-1">
                    <span 
                      className="text-xs font-bold text-ocean-blue-500 uppercase tracking-wider hover:underline"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevents navigating to the chapter
                        navigate(`/novel/${chapter.novelId}`);
                      }}
                    >
                      {chapter.novelTitle}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs text-gray-500">Chapter {chapter.chapterNumber}</span>
                  </div>

                  {/* Chapter Title */}
                  <h3 className="font-bold text-lg text-deep-space-blue-800 group-hover:text-ocean-blue-600 transition-colors">
                    {chapter.chapterTitle}
                  </h3>

                  {/* Content Snippet */}
                  <div
                    className="text-sm text-gray-600 line-clamp-2 mt-2 italic border-l-2 border-gray-200 pl-3"
                    dangerouslySetInnerHTML={{ __html: chapter.content }}
                  ></div>

                  <div className="mt-3 flex items-center text-xs text-gray-400">
                    <Search size={12} className="mr-1" />
                    <span>Found in matches</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      {!loading && query && results.length === 0 && (
        <p className="text-gray-500">No results found for "{query}"</p>
      )}
    </div>
  );
};