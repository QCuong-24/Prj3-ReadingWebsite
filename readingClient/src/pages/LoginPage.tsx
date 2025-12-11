import { useState } from "react";
import { login } from "../services/auth.api";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { User } from "../types/user.types";

export const LoginPage = () => {
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await login(email, password);

      const user: User = res.data.user;

      loginUser(user, res.data.token);
      navigate("/");

    } catch (err) {
      console.log("LOGIN ERROR:", err);
      alert("Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow mt-10">
      <h1 className="text-2xl font-bold text-deep-space-blue-800 mb-4">
        Login
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded focus:ring-2 focus:ring-ocean-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded focus:ring-2 focus:ring-ocean-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-ocean-blue-500 hover:bg-ocean-blue-600 text-white p-3 rounded">
          Login
        </button>
      </form>

      <p className="mt-4 text-sm">
        Don't have an account?{" "}
        <Link to="/register" className="text-ocean-blue-600">
          Register
        </Link>
      </p>
    </div>
  );
};