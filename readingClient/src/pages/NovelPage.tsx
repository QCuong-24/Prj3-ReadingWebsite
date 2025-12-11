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

export const NovelPage = () => {
  const { id } = useParams();
  const novelId = Number(id);
  
  const [novel, setNovel] = useState<NovelDTO | null>(null);
  const [chapters, setChapters] = useState<ChapterDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);
  const navigation = useNavigate();

  const { user } = useAuth();

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

        {novel.publicationDate && (
          <p className="text-gray-700 mt-2">
            Publication Date:{" "}
            <span className="font-medium">
              {new Date(novel.publicationDate).toLocaleDateString()}
            </span>
          </p>
        )}

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
        {user?.roles.includes("ROLE_MANAGER") || user?.roles.includes("ROLE_ADMIN") ? (
          <div className="flex gap-3 mt-4">

            {/* Add Chapter button */}
            <Link
              to={`/novel/${novelId}/chapter/add`}
              className="px-4 py-2 bg-ocean-blue-500 text-white rounded hover:bg-ocean-blue-600"
            >
              + Add Chapter
            </Link>

            {/* Edit Novel button */}
            <Link
              to={`/novel/${novelId}/edit`}
              className="px-4 py-2 bg-ocean-blue-500 text-white rounded hover:bg-ocean-blue-600"
            >
              ~ Edit Novel
            </Link>

            {/* Delete Novel button */}
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
        ) : null}

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
              <div className="p-4 bg-white rounded-lg shadow border border-ocean-blue-100 hover:border-ocean-blue-500 hover:shadow-md transition flex items-center justify-between">

                {/* Left side: Chapter link */}
                <Link
                  to={`/novel/${novelId}/chapter/${chapter.id}`}
                  className="flex-1"
                >
                  <p className="text-lg font-medium text-deep-space-blue-800">
                    Chapter {chapter.chapterNumber}: {chapter.title}
                  </p>

                  {/* Show updatedAt */}
                  {chapter.updatedAt && (
                    <p className="text-sm text-gray-500 mt-1">
                      Updated: {new Date(chapter.updatedAt).toLocaleDateString()}
                    </p>
                  )}
                </Link>

                {/* Right side: Edit + Delete buttons (manager/admin only) */}
                {(user?.roles.includes("ROLE_MANAGER") ||
                  user?.roles.includes("ROLE_ADMIN")) && (
                  <div className="flex items-center gap-2">

                    {/* Edit button */}
                    <Button
                      onClick={() =>
                        navigation(`/novel/${novelId}/chapter/${chapter.id}/edit`)
                      }
                      className="px-3 py-1 bg-ocean-blue-500 text-white rounded hover:bg-ocean-blue-600"
                    >
                      Edit
                    </Button>

                    {/* Delete button */}
                    <Button
                      onClick={async () => {
                        if (!confirm("Are you sure you want to delete chapter: " + chapter.chapterNumber + " " + chapter.title + "?")) return;

                        try {
                          await deleteChapter(Number(chapter.id));
                          setChapters((prev) =>
                            prev.filter((c) => c.id !== chapter.id)
                          );
                        } catch (err) {
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
    </div>
  );
};