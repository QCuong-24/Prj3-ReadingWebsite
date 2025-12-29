import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Thêm Interceptor để đính kèm Token vào MỌI request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); 
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//=====================
// Api for follow novel
//=====================
export const isFollowed = (id: number) =>
  api.get(`/novels/${id}/isFollowed`);

export const followNovel = (id: number) =>
  api.post(`/novels/${id}/follow`);

export const unfollowNovel = (id: number) => 
  api.delete(`/novels/${id}/unfollow`);

export const getFollowedNovels = () =>
  api.get(`/novels/followed`);

//====================
// Api for history log
//====================
export const continueReading = (userId: number) =>
  api.get(`/history/${userId}/continue`);

export const logReading = (userId: number, chapterId: number) =>
  api.post(`/history/log`, null, { params: { userId, chapterId } });

export const getHistory = (userId: number) =>
  api.get(`/history/${userId}`);

export const deleteHistory = (userId: number, chapterId: number) =>
  api.delete(`/history/${userId}/chapter/${chapterId}`);

export const deleteAllHistory = (userId: number) =>
  api.delete(`/history/${userId}`);

//=================
// Api for bookmark
//=================
export const isBookmarked = (userId: number, chapterId: number) =>
  api.get(`/bookmarks/${userId}/${chapterId}/isBookmarked`);

export const addBookmark = (userId: number, chapterId: number) =>
  api.post(`/bookmarks/${userId}/${chapterId}`);

export const removeBookmark = (userId: number, chapterId: number) =>
  api.delete(`/bookmarks/${userId}/${chapterId}`);

export const getBookmarks = (userId: number) =>
  api.get(`/bookmarks/${userId}`);

//=================
// Api for notifications
//=================
// Get all notifications
export const getNotifications = (userId: number) =>
    api.get(`/notifications/${userId}`);

// Get unread notifications
export const getUnreadNotifications = (userId: number) => 
    api.get(`/notifications/${userId}/unread`);

// Get unread notifications
export const getReadNotifications = (userId: number) => 
    api.get(`/notifications/${userId}/read`);

//Mark Notification as read
export const markNotificationAsRead = async (userId: number, notificationId: number) => {
  return await api.put(`/notifications/${userId}/${notificationId}/read`);
};

//Delete a notification
export const deleteNotification = (userId: number, id: number) =>
  api.delete(`/notifications/${userId}/${id}`);

// Delete all user's notifications
export const deleteAllNotifications = (userId: number) =>
  api.delete(`/notifications/${userId}`);

//=================
// Api for comments
//=================
import { CommentDTO } from "../types/novel.types";

// Create comment
export const createComment = (dto: CommentDTO) =>
  api.post<CommentDTO>("/comments", dto);

// Get all comments for a chapter (paginated)
export const getCommentsByChapter = (chapterId: number, page: number = 0, size: number = 10) =>
  api.get(`/comments/chapter/${chapterId}?page=${page}&size=${size}`);

// Get all comments for a novel (paginated)
export const getCommentsByNovel = (novelId: number, page: number = 0, size: number = 10) =>
  api.get(`/comments/novel/${novelId}?page=${page}&size=${size}`);

// Get replies for a comment
export const getReplies = (commentId: number) =>
  api.get<CommentDTO[]>(`/comments/reply/${commentId}`);

// Delete comment
export const deleteComment = (id: number) =>
  api.delete(`/comments/${id}`);

export default api;