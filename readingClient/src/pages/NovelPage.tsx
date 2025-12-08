import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { NovelDTO, ChapterDTO } from "../types/novel.types";
import { getNovelById, getChaptersByNovel } from "../services/api";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";
import { handleApiError, ErrorState } from "../utils/handleApiError";
import { Breadcrumb } from "../components/Breadcrumb";

export const NovelPage = () => {
  const { id } = useParams();
  const novelId = Number(id);

  const [novel, setNovel] = useState<NovelDTO | null>(null);
  const [chapters, setChapters] = useState<ChapterDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);

  const fetchNovelData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [novelRes, chaptersRes] = await Promise.all([
        getNovelById(novelId),
        getChaptersByNovel(novelId),
      ]);

      setNovel(novelRes.data);
      setChapters(chaptersRes.data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNovelData();
  }, [novelId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  if (!novel) {
    return (
      <p className="text-gray-700">
        Novel not found or failed to load.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: novel.title },
        ]}
      />

      {/* Novel Header */}
      <div className="bg-white p-6 rounded-lg shadow border border-ocean-blue-100">
        <h1 className="text-4xl font-bold text-deep-space-blue-800 mb-3">
          {novel.title}
        </h1>

        {novel.author && (
          <p className="text-lg text-gray-700 mb-2">
            Author: <span className="font-medium">{novel.author}</span>
          </p>
        )}

        <span className="px-3 py-1 text-sm rounded bg-turquoise-surf-100 text-turquoise-surf-800">
          {novel.status}
        </span>

        {novel.description && (
          <p className="mt-4 text-gray-700 leading-relaxed">
            {novel.description}
          </p>
        )}
      </div>

      {/* Chapters List */}
      <div>
        <h2 className="text-2xl font-semibold text-deep-space-blue-800 mb-4">
          Chapters
        </h2>

        {chapters.length === 0 && (
          <p className="text-gray-600">No chapters available.</p>
        )}

        <ul className="space-y-3">
          {chapters.map((chapter) => (
            <li key={chapter.id}>
              <Link
                to={`/novel/${novelId}/chapter/${chapter.id}`}
                className="block p-4 bg-white rounded-lg shadow border border-ocean-blue-100 hover:border-ocean-blue-500 hover:shadow-md transition"
              >
                <p className="text-lg font-medium text-deep-space-blue-800">
                  Chapter {chapter.chapterNumber}: {chapter.title}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};