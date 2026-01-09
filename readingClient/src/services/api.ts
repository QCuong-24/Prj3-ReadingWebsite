import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Novel APIs
export const getNovels = () => api.get("/novels");

export const getNovelsByPage = (page: number, size: number) =>
  api.get(`/novels/page?page=${page}&size=${size}`);

export const getNovelById = (id: number) =>
  api.get(`/novels/${id}`);

export const viewNovelById = (id: number) =>
  api.post(`/novels/${id}/view`);

export const getChaptersByNovel = (novelId: number) =>
  api.get(`/chapters`, { params: { novelId } });

export const getChapterById = (chapterId: number) =>
  api.get(`/chapters/${chapterId}`);

// Search Novels
export const searchNovels = (query: string, page?: number) =>
  api.get(`/search/novels`, { params: { q: query, page } });

// Search Chapters
export const searchChapters = (query: string, page?: number) =>
  api.get(`/search/chapters`, { params: { q: query, page } });

export default api;