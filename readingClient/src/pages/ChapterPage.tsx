import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChapterDetailDTO, ChapterDTO } from "../types/novel.types";
import { getChapterById, getChaptersByNovel } from "../services/api";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";
import { handleApiError, ErrorState } from "../utils/handleApiError";
import { Breadcrumb } from "../components/Breadcrumb";

export const ChapterPage = () => {
  const { novelId, chapterId } = useParams();
  const navigate = useNavigate();

  const novelIdNum = Number(novelId);
  const chapterIdNum = Number(chapterId);

  const [chapter, setChapter] = useState<ChapterDetailDTO | null>(null);
  const [allChapters, setAllChapters] = useState<ChapterDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);

  const fetchChapterData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [chapterRes, chaptersRes] = await Promise.all([
        getChapterById(chapterIdNum),
        getChaptersByNovel(novelIdNum),
      ]);

      setChapter(chapterRes.data);
      setAllChapters(chaptersRes.data);

      // Scroll to top when chapter changes
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChapterData();
  }, [chapterIdNum]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  if (!chapter) {
    return <p className="text-gray-700">Chapter not found.</p>;
  }

  // Determine previous and next chapters
  const currentIndex = allChapters.findIndex((c) => c.id === chapterIdNum);
  const prevChapter = allChapters[currentIndex - 1];
  const nextChapter = allChapters[currentIndex + 1];

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Novel", to: `/novel/${novelId}` },
          { label: chapter.title },
        ]}
      />

      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow border border-ocean-blue-100">
        <h1 className="text-3xl font-bold text-deep-space-blue-800 mb-2">
          Chapter {chapter.chapterNumber}: {chapter.title}
        </h1>

        <p className="text-sm text-gray-500">
          Updated at: {chapter.updatedAt}
        </p>

        <Link
          to={`/novel/${novelIdNum}`}
          className="text-ocean-blue-600 hover:text-ocean-blue-700 font-medium"
        >
          ← Back to Novel
        </Link>
      </div>

      {/* Chapter Content */}
      <div className="bg-white p-6 rounded-lg shadow border border-ocean-blue-100 leading-relaxed text-gray-800 text-lg whitespace-pre-line">
        {/* 
          NOTE: Replace this with chapter.content when backend provides it.
          For now, placeholder text is used.
        */}
        {chapter.content ?? "Chapter content goes here..."}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        {prevChapter ? (
          <button
            onClick={() =>
              navigate(`/novel/${novelIdNum}/chapter/${prevChapter.id}`)
            }
            className="px-4 py-2 bg-ocean-blue-500 hover:bg-ocean-blue-600 text-white rounded shadow"
          >
            ← Previous Chapter
          </button>
        ) : (
          <div />
        )}

        {nextChapter ? (
          <button
            onClick={() =>
              navigate(`/novel/${novelIdNum}/chapter/${nextChapter.id}`)
            }
            className="px-4 py-2 bg-ocean-blue-500 hover:bg-ocean-blue-600 text-white rounded shadow"
          >
            Next Chapter →
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};