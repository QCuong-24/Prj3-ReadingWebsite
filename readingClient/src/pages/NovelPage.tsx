import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { NovelDTO, ChapterDTO } from "../types/novel.types";
import { getNovelById, getChaptersByNovel } from "../services/api";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";
import { handleApiError, ErrorState } from "../utils/handleApiError";
import { Breadcrumb } from "../components/Breadcrumb";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/Button";
import { useNavigate } from 'react-router-dom';
import { deleteChapter, deleteNovel } from "../services/manager.api";
import { followNovel, unfollowNovel, isFollowed } from "../services/user.api";

export const NovelPage = () => {
  const { id } = useParams();
  const novelId = Number(id);
  
  const [novel, setNovel] = useState<NovelDTO | null>(null);
  const [chapters, setChapters] = useState<ChapterDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);
  const navigation = useNavigate();

  const [isFollowedState, setIsFollowedState] = useState(false);
  

  const [currentPage, setCurrentPage] = useState(1);
  const chaptersPerPage = 10;
  const indexOfLast = currentPage * chaptersPerPage;
  const indexOfFirst = indexOfLast - chaptersPerPage;
  const currentChapters = chapters.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(chapters.length / chaptersPerPage);

  const { user } = useAuth();

  const handleFollowToggle = async () => {
    if (!novel) return;

    const wasFollowed = isFollowedState;
    try {
      if (wasFollowed) {
        await unfollowNovel(novelId);
        setIsFollowedState(false);
        setNovel(prev => prev ? { ...prev, followers: Math.max(0, prev.followers - 1) } : null);
      } else {
        await followNovel(novelId);
        setIsFollowedState(true);
        setNovel(prev => prev ? { ...prev, followers: prev.followers + 1 } : null);
      }
    } catch (err) {
      setError(handleApiError(err));
    }
  };

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

      // Check if followed
      if (user) {
        try {
          const followedRes = await isFollowed(novelId);
          setIsFollowedState(followedRes.data);
        } catch (err) {
          console.error("Failed to check follow status", err);
        }
      }
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const generatePageNumbers = () => {
    const pages = [];
    pages.push(1);
    if (currentPage > 2) {
      pages.push("...");
    }
    if (currentPage !== 1 && currentPage !== totalPages) {
      pages.push(currentPage);
    }
    if (currentPage < totalPages - 1) {
      pages.push("...");
    }
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    return pages;
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
      <div className="bg-white p-6 rounded-lg shadow border border-ocean-blue-100 flex gap-6">

        {/* Novel Cover */}
        <img
          src={novel.coverImageUrl || "/default-cover.jpg"}
          alt="Novel Cover"
          className="w-40 h-56 object-cover rounded-lg shadow-md border border-ocean-blue-200"
        />

        {/* Novel Info */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-deep-space-blue-800 mb-3">
            {novel.title}
          </h1>

          {novel.author && (
            <p className="text-lg text-gray-700 mb-1">
              Author: <span className="font-medium">{novel.author}</span>
            </p>
          )}

          {novel.publicationDate && (
            <p className="text-gray-700">
              Publication Date:{" "}
              <span className="font-medium">
                {new Date(novel.publicationDate).toLocaleDateString()}
              </span>
            </p>
          )}

          <span className="inline-block mt-2 px-3 py-1 text-sm rounded bg-turquoise-surf-100 text-turquoise-surf-800">
            {novel.status}
          </span>

          {novel.description && (
            <p className="mt-4 text-gray-700 leading-relaxed">
              {novel.description}
            </p>
          )}

          {/* Stats + Follow Button */}
          <div className="flex items-center gap-6 mt-6">

            {/* Views */}
            <div className="flex items-center gap-2 text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-ocean-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="font-medium">{novel.views ?? 0}</span>
            </div>

            {/* Followers */}
            <div className="flex items-center gap-2 text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" fill={isFollowedState ? "red" : "none"} stroke={isFollowedState ? "none" : "red"} viewBox="0 0 24 24" className="w-6 h-6">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span className="font-medium">{novel.followers ?? 0}</span>
            </div>

            {/* Follow Button */}
            {user && (<button
              onClick={handleFollowToggle}
              className={`px-4 py-2 text-white rounded shadow ${
                isFollowedState
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-ocean-blue-500 hover:bg-ocean-blue-600"
              }`}
            >
              {isFollowedState ? "Unfollow" : "Follow"}
            </button>)}
          </div>
          
        </div>
      </div>

      {/* Manager Buttons (separated container) */}
      {(user?.roles.includes("MANAGER") || user?.roles.includes("ADMIN")) && (
        <div className="bg-white p-4 rounded-lg shadow border border-ocean-blue-100 mt-4 flex flex-wrap justify-center gap-3">

          <Link
            to={`/novel/${novelId}/chapter/add`}
            className="px-4 py-2 bg-ocean-blue-500 text-white rounded hover:bg-ocean-blue-600"
          >
            + Add Chapter
          </Link>

          <Link
            to={`/novel/${novelId}/edit`}
            className="px-4 py-2 bg-ocean-blue-500 text-white rounded hover:bg-ocean-blue-600"
          >
            ~ Edit Novel
          </Link>

          <Button
            onClick={async () => {
              if (!confirm("Are you sure you want to delete this novel?")) return;
              try {
                await deleteNovel(novelId);
                navigation("/");
              } catch (err) {
                alert("Failed to delete novel");
              }
            }}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            - Delete Novel
          </Button>

        </div>
      )}

      {/* Chapters List */}
      <div>
        <h2 className="text-2xl font-semibold text-deep-space-blue-800 mb-4">
          Chapters
        </h2>

        {chapters.length === 0 && (
          <p className="text-gray-600">No chapters available.</p>
        )}

        <ul className="space-y-3">
          {currentChapters.map((chapter) => (
            <li key={chapter.id}>
              <div className="p-4 bg-white rounded-lg shadow border border-ocean-blue-100 hover:border-ocean-blue-500 hover:shadow-md transition flex items-center justify-between">

                {/* Left side */}
                <Link
                  to={`/novel/${novelId}/chapter/${chapter.id}`}
                  className="flex items-start gap-4 flex-1"
                >
                  {/* Chapter icon */}
                  <div className="w-10 h-10 flex items-center justify-center bg-ocean-blue-100 text-ocean-blue-700 rounded-full font-bold shadow">
                    {chapter.chapterNumber}
                  </div>

                  <div>
                    <p className="text-lg font-semibold text-deep-space-blue-800">
                      {chapter.title}
                    </p>

                    {chapter.updatedAt && (
                      <p className="text-sm text-gray-500 mt-1">
                        Updated: {new Date(chapter.updatedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </Link>

                {/* Right side: Edit/Delete */}
                {(user?.roles.includes("MANAGER") ||
                  user?.roles.includes("ADMIN")) && (
                  <div className="flex items-center gap-2">

                    <Button
                      onClick={() =>
                        navigation(`/novel/${novelId}/chapter/${chapter.id}/edit`)
                      }
                      className="px-3 py-1 bg-ocean-blue-500 text-white rounded hover:bg-ocean-blue-600"
                    >
                      Edit
                    </Button>

                    <Button
                      onClick={async () => {
                        if (!confirm(`Delete chapter ${chapter.chapterNumber}: ${chapter.title}?`)) return;

                        try {
                          await deleteChapter(Number(chapter.id));
                          setChapters((prev) => prev.filter((c) => c.id !== chapter.id));
                        } catch {
                          alert("Failed to delete chapter");
                        }
                      }}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Smart Minimal Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-4 mt-6">

          {/* Page Buttons */}
          <div className="flex items-center gap-2">

            {/* Prev */}
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-ocean-blue-500 hover:bg-ocean-blue-600 text-white"
              }`}
            >
              &lt;
            </button>

            {/* Page Numbers */}
            {generatePageNumbers().map((num, idx) =>
              typeof num === "number" ? (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(num)}
                  className={`px-3 py-1 rounded ${
                    currentPage === num
                      ? "bg-ocean-blue-600 text-white"
                      : "bg-ocean-blue-100 text-ocean-blue-700 hover:bg-ocean-blue-200"
                  }`}
                >
                  {num}
                </button>
              ) : (
                <span key={idx} className="px-2 text-gray-500">{num}</span>
              )
            )}

            {/* Next */}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-ocean-blue-500 hover:bg-ocean-blue-600 text-white"
              }`}
            >
              &gt;
            </button>
          </div>

          {/* Jump to page */}
          <div className="flex items-center gap-2">
            <input
              id="jumpPageInput"
              type="number"
              min={1}
              max={totalPages}
              placeholder="Page"
              className="w-20 p-2 border rounded"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const value = Number(e.currentTarget.value);
                  if (value >= 1 && value <= totalPages) {
                    setCurrentPage(value);
                  }
                }
              }}
            />
            <button
              onClick={() => {
                const input = document.getElementById("jumpPageInput") as HTMLInputElement;
                const value = Number(input.value);
                if (value >= 1 && value <= totalPages) {
                  setCurrentPage(value);
                }
              }}
              className="px-3 py-1 bg-ocean-blue-500 text-white rounded hover:bg-ocean-blue-600"
            >
              Go
            </button>
          </div>

        </div>
      )}
    </div>
  );
};