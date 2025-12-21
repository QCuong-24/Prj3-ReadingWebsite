import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { NovelDTO } from "../types/novel.types";
import { ReadingHistory, Bookmark } from "../types/shelf.type";
import { handleApiError, ErrorState } from "../utils/handleApiError";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";
import { NovelCard } from "../components/NovelCard";
import { Button } from "../components/Button";
import {
  getHistory,
  deleteHistory,
  deleteAllHistory,
  getFollowedNovels,
  unfollowNovel,
  getBookmarks,
  removeBookmark
} from "../services/user.api";

export const ShelfPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'history' | 'followed' | 'bookmarks'>('history');

  // History state
  const [history, setHistory] = useState<ReadingHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<ErrorState | null>(null);

  // Followed novels state
  const [followedNovels, setFollowedNovels] = useState<NovelDTO[]>([]);
  const [followedLoading, setFollowedLoading] = useState(false);
  const [followedError, setFollowedError] = useState<ErrorState | null>(null);

  // Bookmarks state
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [bookmarksLoading, setBookmarksLoading] = useState(false);
  const [bookmarksError, setBookmarksError] = useState<ErrorState | null>(null);

  const fetchHistory = async () => {
    if (!user) return;
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      const response = await getHistory(user.userId);
      setHistory(response.data);
    } catch (err) {
      setHistoryError(handleApiError(err));
    } finally {
      setHistoryLoading(false);
    }
  };

  const fetchFollowedNovels = async () => {
    setFollowedLoading(true);
    setFollowedError(null);
    try {
      const response = await getFollowedNovels();
      setFollowedNovels(response.data);
    } catch (err) {
      setFollowedError(handleApiError(err));
    } finally {
      setFollowedLoading(false);
    }
  };

  const fetchBookmarks = async () => {
    if (!user) return;
    setBookmarksLoading(true);
    setBookmarksError(null);
    try {
      const response = await getBookmarks(user.userId);
      setBookmarks(response.data);
    } catch (err) {
      setBookmarksError(handleApiError(err));
    } finally {
      setBookmarksLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'history') fetchHistory();
    else if (activeTab === 'followed') fetchFollowedNovels();
    else if (activeTab === 'bookmarks') fetchBookmarks();
  }, [activeTab, user]);

  const handleDeleteHistory = async (chapterId: number) => {
    if (!user) return;
    try {
      await deleteHistory(user.userId, chapterId);
      setHistory(prev => prev.filter(h => h.chapterId !== chapterId));
    } catch (err) {
      setHistoryError(handleApiError(err));
    }
  };

  const handleDeleteAllHistory = async () => {
    if (!user) return;
    try {
      await deleteAllHistory(user.userId);
      setHistory([]);
    } catch (err) {
      setHistoryError(handleApiError(err));
    }
  };

  const handleUnfollow = async (novelId: number) => {
    try {
      await unfollowNovel(novelId);
      setFollowedNovels(prev => prev.filter(n => n.id !== novelId));
    } catch (err) {
      setFollowedError(handleApiError(err));
    }
  };

  const handleRemoveBookmark = async (chapterId: number) => {
    if (!user) return;
    try {
      await removeBookmark(user.userId, chapterId);
      setBookmarks(prev => prev.filter(b => b.id !== chapterId));
    } catch (err) {
      setBookmarksError(handleApiError(err));
    }
  };

  if (!user) {
    return <div className="text-center py-8">Please login to view your shelf</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Shelf</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded ${activeTab === 'history' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Reading History
        </button>
        <button
          onClick={() => setActiveTab('followed')}
          className={`px-4 py-2 rounded ${activeTab === 'followed' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Followed Novels
        </button>
        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`px-4 py-2 rounded ${activeTab === 'bookmarks' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Bookmarks
        </button>
      </div>

      {/* History Tab */}
      {activeTab === 'history' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Reading History</h2>
            <Button onClick={handleDeleteAllHistory} variant="danger">
              Clear All History
            </Button>
          </div>
          {historyLoading && <LoadingSpinner />}
          {historyError && <ErrorMessage error={historyError} />}
          {!historyLoading && !historyError && (
            <div className="space-y-4">
              {history.map((item) => (
                <div key={item.chapterId} className="flex justify-between items-center p-4 border rounded">
                  <div>
                    <h3 className="font-semibold">{item.chapterTitle}</h3>
                    <p className="text-sm text-gray-600">Chapter {item.chapterNumber}</p>
                    <p className="text-sm text-gray-500">Last read: {new Date(item.lastReadAt).toLocaleDateString()}</p>
                  </div>
                  <Button onClick={() => handleDeleteHistory(item.chapterId)} variant="danger" size="sm">
                    Remove
                  </Button>
                </div>
              ))}
              {history.length === 0 && <p className="text-center py-8">No reading history yet.</p>}
            </div>
          )}
        </div>
      )}

      {/* Followed Novels Tab */}
      {activeTab === 'followed' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Followed Novels</h2>
          {followedLoading && <LoadingSpinner />}
          {followedError && <ErrorMessage error={followedError} />}
          {!followedLoading && !followedError && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {followedNovels.map((novel) => (
                <div key={novel.id} className="relative">
                  <NovelCard novel={novel} />
                  {novel.id && (
                    <Button
                      onClick={() => handleUnfollow(Number(novel.id))}
                      variant="danger"
                      size="sm"
                      className="absolute top-2 right-2"
                    >
                      Unfollow
                    </Button>
                  )}
                </div>
              ))}
              {followedNovels.length === 0 && <p className="text-center py-8 col-span-full">No followed novels yet.</p>}
            </div>
          )}
        </div>
      )}

      {/* Bookmarks Tab */}
      {activeTab === 'bookmarks' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Bookmarks</h2>
          {bookmarksLoading && <LoadingSpinner />}
          {bookmarksError && <ErrorMessage error={bookmarksError} />}
          {!bookmarksLoading && !bookmarksError && (
            <div className="space-y-4">
              {bookmarks.map((bookmark) => (
                <div key={bookmark.id} className="flex justify-between items-center p-4 border rounded hover:bg-gray-50 cursor-pointer" onClick={() => bookmark.id && navigate(`/novel/${bookmark.novelId}/chapter/${bookmark.id}`)}>
                  <div>
                    <h3 className="font-semibold">{bookmark.title}</h3>
                    <p className="text-sm text-gray-600">Chapter {bookmark.chapterNumber}</p>
                  </div>
                  <div onClick={(e) => { e.stopPropagation(); bookmark.id && handleRemoveBookmark(bookmark.id); }}>
                    <Button variant="danger" size="sm">
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              {bookmarks.length === 0 && <p className="text-center py-8">No bookmarks yet.</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};