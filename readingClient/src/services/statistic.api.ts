import { StatisticDTO } from "../types/novel.types";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/statistics",
});

// ========================= VIEWS =========================

// Tổng view theo ngày
export const getTotalViewsByDay = (date: string) =>
  api.get<number>("/views/total/day", { params: { date } });

// Tổng view theo tháng
export const getTotalViewsByMonth = (month: number, year: number) =>
  api.get<number>("/views/total/month", { params: { month, year } });

// Tổng view theo năm
export const getTotalViewsByYear = (year: number) =>
  api.get<number>("/views/total/year", { params: { year } });

// Top novel theo view trong ngày
export const getTopViewedByDay = (date: string, limit = 10) =>
  api.get<StatisticDTO[]>("/views/top/day", { params: { date, limit } });

// Top novel theo view trong tháng
export const getTopViewedByMonth = (month: number, year: number, limit = 10) =>
  api.get<StatisticDTO[]>("/views/top/month", { params: { month, year, limit } });

// Top novel theo view trong năm
export const getTopViewedByYear = (year: number, limit = 10) =>
  api.get<StatisticDTO[]>("/views/top/year", { params: { year, limit } });
// ========================= FOLLOWS =========================

// Tổng follow theo ngày
export const getTotalFollowsByDay = (date: string) =>
  api.get<number>("/follows/total/day", { params: { date } });

// Tổng follow theo tháng
export const getTotalFollowsByMonth = (month: number, year: number) =>
  api.get<number>("/follows/total/month", { params: { month, year } });

// Tổng follow theo năm
export const getTotalFollowsByYear = (year: number) =>
  api.get<number>("/follows/total/year", { params: { year } });

// Top novel theo follow trong ngày
export const getTopFollowedByDay = (date: string, limit = 10) =>
  api.get<StatisticDTO[]>("/follows/top/day", { params: { date, limit } });

// Top novel theo follow trong tháng
export const getTopFollowedByMonth = (month: number, year: number, limit = 10) =>
  api.get<StatisticDTO[]>("/follows/top/month", { params: { month, year, limit } });

// Top novel theo follow trong năm
export const getTopFollowedByYear = (year: number, limit = 10) =>
  api.get<StatisticDTO[]>("/follows/top/year", { params: { year, limit } });
export default api;