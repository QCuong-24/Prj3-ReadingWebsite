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

// Cập nhật user
export const updateUser = (id: number, data: User) =>
  api.put<User>(`/admin/users/${id}`, data);

// Xóa user
export const deleteUser = (id: number) => api.delete(`/admin/users/${id}`);

export default api;