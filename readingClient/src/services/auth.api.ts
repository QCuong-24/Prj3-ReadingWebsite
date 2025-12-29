import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/auth",
});

export const login = (email: string, password: string) =>
  api.post("/login", { email, password });

export const requestOtp = (email: string) => 
  api.post("/request-otp", { email });

export const register = (username: string, email: string, password: string, otpCode: string) => {
  console.log({ username, email, password, otpCode })
  return api.post("/register", { username, email, password, otpCode });
}