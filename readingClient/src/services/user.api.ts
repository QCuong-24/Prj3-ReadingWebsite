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

export default api;