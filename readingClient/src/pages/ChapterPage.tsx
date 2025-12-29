import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChapterDetailDTO, ChapterDTO } from "../types/novel.types";
import { getChapterById, getChaptersByNovel, viewNovelById } from "../services/api";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";
import { handleApiError, ErrorState } from "../utils/handleApiError";
import { Breadcrumb } from "../components/Breadcrumb";
import { useAuth } from "../context/AuthContext";
import { logReading, addBookmark, removeBookmark, isBookmarked } from "../services/user.api";
import { ChapterCommentSection } from "../components/ChapterCommentSection";

export const ChapterPage = () => {
  const { novelId, chapterId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const novelIdNum = Number(novelId);
  const chapterIdNum = Number(chapterId);

  const [chapter, setChapter] = useState<ChapterDetailDTO | null>(null);
  const [allChapters, setAllChapters] = useState<ChapterDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);
  const [isBookmarkedState, setIsBookmarkedState] = useState(false);

  const viewedRef = useRef<number | null>(null);

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

      //Increase view only once per chapter
      if (viewedRef.current !== chapterIdNum) {
        viewNovelById(novelIdNum);
        viewedRef.current = chapterIdNum;
        console.log("Views increase");
        // Log reading history if user is logged in
        if (user) {
          try {
            await logReading(user.userId, chapterIdNum);
            console.log("Reading history logged");
          } catch (logErr) {
            console.error("Failed to log reading history:", logErr);
          }
        }

      }      

      // Check bookmark status if user is logged in
      if (user) {
        try {
          const bookmarkRes = await isBookmarked(user.userId, chapterIdNum);
          setIsBookmarkedState(bookmarkRes.data);
        } catch (bookmarkErr) {
          console.error("Failed to check bookmark status:", bookmarkErr);
          setIsBookmarkedState(false);
        }
      }
      
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBookmark = async () => {
    if (!user) return;

    try {
      if (isBookmarkedState) {
        await removeBookmark(user.userId, chapterIdNum);
        setIsBookmarkedState(false);
      } else {
        await addBookmark(user.userId, chapterIdNum);
        setIsBookmarkedState(true);
      }
    } catch (err) {
      console.error("Failed to toggle bookmark:", err);
      setError(handleApiError(err));
    }
  };

  useEffect(() => {
    fetchChapterData();
  }, [chapterIdNum, user]);

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
  
    {/* Unified Container */}
    <div className="bg-white p-6 rounded-lg shadow border border-ocean-blue-100 space-y-6">

      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-deep-space-blue-800">
            Chapter {chapter.chapterNumber}: {chapter.title}
          </h1>
          {user && (
            <button
              onClick={handleToggleBookmark}
              className={`p-2 rounded-full transition-colors ${
                isBookmarkedState
                  ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={isBookmarkedState ? 'Remove bookmark' : 'Add bookmark'}
            >
              <svg
                className="w-6 h-6"
                fill={isBookmarkedState ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </button>
          )}
        </div>

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

      {/* Top Compact Navigation */}
      <div className="flex items-center justify-center gap-4">

        {/* < Previous */}
        <button
          disabled={!prevChapter}
          onClick={() =>
            prevChapter &&
            navigate(`/novel/${novelIdNum}/chapter/${prevChapter.id}`)
          }
          className={`px-3 py-1 rounded text-lg ${
            prevChapter
              ? "bg-ocean-blue-500 hover:bg-ocean-blue-600 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          &lt;
        </button>

        {/* Dropdown */}
        <select
          className="p-2 border rounded bg-white shadow focus:ring-2 focus:ring-ocean-blue-500"
          value={chapterIdNum}
          onChange={(e) =>
            navigate(`/novel/${novelIdNum}/chapter/${e.target.value}`)
          }
        >
          {allChapters.map((c) => (
            <option key={c.id} value={c.id}>
              Chapter {c.chapterNumber}: {c.title}
            </option>
          ))}
        </select>

        {/* > Next */}
        <button
          disabled={!nextChapter}
          onClick={() =>
            nextChapter &&
            navigate(`/novel/${novelIdNum}/chapter/${nextChapter.id}`)
          }
          className={`px-3 py-1 rounded text-lg ${
            nextChapter
              ? "bg-ocean-blue-500 hover:bg-ocean-blue-600 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          &gt;
        </button>
      </div>

      {/* Chapter Content */}
      <div className="leading-relaxed text-gray-800 text-lg whitespace-pre-line">
        {chapter.content ?? "Chapter content goes here..."}
      </div>

      {/* Comments */}
      <ChapterCommentSection chapterId={chapterIdNum} novelId={novelIdNum}/>

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