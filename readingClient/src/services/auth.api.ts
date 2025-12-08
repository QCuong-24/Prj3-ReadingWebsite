import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/auth",
});

export const login = (email: string, password: string) =>
  api.post("/login", { email, password });

export const register = (username: string, email: string, password: string) =>
  api.post("/register", { username, email, password });