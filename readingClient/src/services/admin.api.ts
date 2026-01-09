import axios from "axios";
import { User } from "../types/user.types";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Interceptor gắn token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// =======================
// Admin APIs
// =======================

// Lấy tất cả user
export const getAllUsers = () => api.get<User[]>("/admin/users");

// Lấy user theo ID
export const getUserById = (id: number) => api.get<User>(`/admin/users/${id}`);

// Tao user mới
export const createUser = (data: User) =>
  api.post<User>("/admin/users", data);

// Cập nhật user
export const updateUser = (id: number, data: User) =>
  api.put<User>(`/admin/users/${id}`, data);

// Xóa user
export const deleteUser = (id: number) => api.delete(`/admin/users/${id}`);

// =======================
// Elastic Status Manager APIs
// =======================

// Lấy trạng thái hiện tại
export const getElasticStatus = () => 
  api.get("/admin/sync/status");

// Bật tắt đồng bộ
export const toggleElasticSync = () =>
  api.post("/admin/sync/toggle-elastic");

// Đồng bộ dữ liệu novel
export const syncNovelsToElastic = () =>
  api.post("/admin/sync/novels");

// Đồng bộ dữ liệu chapter
export const syncChaptersToElastic = () =>
  api.post("/admin/sync/chapters");

export default api;