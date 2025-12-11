import axios from "axios";
import { ChapterDetailDTO, NovelDTO } from "../types/novel.types";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Manager APIs

// Novel APIs
export const createNovel = (data: NovelDTO) => 
  api.post("/novels", data);

export const updateNovel = (id: number, data: NovelDTO) =>
  api.put(`/novels/${id}`, data);

export const deleteNovel = (id: number) => 
  api.delete(`/novels/${id}`);

// Chapter APIs
export const createChapter = (data: ChapterDetailDTO) =>
  api.post(`/chapters`, data);

export const updateChapter = (chapterId: number, data: ChapterDetailDTO) =>
  api.put(`/chapters/${chapterId}`, data);

export const deleteChapter = (chapterId: number) =>
  api.delete(`/chapters/${chapterId}`);
