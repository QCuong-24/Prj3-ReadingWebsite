import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { generateMockAvatar } from "../utils/mockAvatar";
import { CommentDTO } from "../types/novel.types";
import {
  getCommentsByChapter,
  createComment,
  deleteComment,
} from "../services/user.api";

interface Props {
  novelId: number;
  chapterId: number;
}

export const ChapterCommentSection = ({ novelId, chapterId }: Props) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<CommentDTO[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchComments = async (pageNum: number = 0) => {
    setLoading(true);
    try {
      const res = await getCommentsByChapter(chapterId, pageNum, 5); // size=5
      setComments(res.data.content);
      setTotalPages(res.data.totalPages);
      setPage(pageNum);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!user || !newComment.trim()) return;
    try {
      await createComment({
        id: 0,
        userId: user.userId,
        userName: user.username,
        avatarUrl: user.avatarUrl,
        novelId,
        chapterId,
        content: newComment,
        createdAt: new Date().toISOString(),
      });
      setNewComment("");
      fetchComments(0); // refresh to first page
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  const handleDeleteComment = async (id: number) => {
    try {
      await deleteComment(id);
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  useEffect(() => {
    fetchComments(0);
  }, [chapterId]);

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-ocean-blue-100 space-y-4 mt-8">
      <h2 className="text-2xl font-semibold text-deep-space-blue-800">
        Comments
      </h2>

      {/* Add Comment */}
      {user ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={handleAddComment}
            className="px-4 py-2 bg-ocean-blue-500 text-white rounded hover:bg-ocean-blue-600"
          >
            Post
          </button>
        </div>
      ) : (
        <p className="text-gray-600">Login to post a comment.</p>
      )}

      {/* Comment List */}
      {loading ? (
        <p className="text-gray-500">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-500">No comments yet.</p>
      ) : (
        <ul className="space-y-3">
          {comments.map((c) => (
            <li
              key={c.id}
              className="p-3 bg-gray-50 rounded border flex gap-3 items-start"
            >
              {/* Avatar */}
              <img
                src={c.avatarUrl || generateMockAvatar(c.userName)}
                alt="avatar"
                className="w-10 h-10 rounded-full border border-gray-300"
              />

              {/* Nội dung */}
              <div className="flex-1 space-y-1">
                {/* User + Chapter */}
                <p className="font-bold text-gray-800">
                  {c.userName}{" "}
                  {c.chapterNumber && (
                    <span className="font-normal text-gray-600">
                      (Chapter {c.chapterNumber})
                    </span>
                  )}
                </p>

                {/* Content */}
                <p className="text-lg text-gray-900">{c.content}</p>

                {/* Time */}
                <p className="text-sm text-gray-500">
                  {new Date(c.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Delete button */}
              {user?.userId === c.userId && (
                <button
                  onClick={() => handleDeleteComment(c.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            disabled={page === 0}
            onClick={() => fetchComments(page - 1)}
            className="px-3 py-1 rounded bg-ocean-blue-500 text-white disabled:bg-gray-300"
          >
            Prev
          </button>
          <span className="px-2">
            Page {page + 1} / {totalPages}
          </span>
          <button
            disabled={page === totalPages - 1}
            onClick={() => fetchComments(page + 1)}
            className="px-3 py-1 rounded bg-ocean-blue-500 text-white disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};