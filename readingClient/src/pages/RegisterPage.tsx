import { useState } from "react";
import { register } from "../services/auth.api";
import { useNavigate, Link } from "react-router-dom";

export const RegisterPage = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await register(username, email, password);
      navigate("/login");
    } catch (err) {
      alert("Register failed");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow mt-10">
      <h1 className="text-2xl font-bold text-deep-space-blue-800 mb-4">
        Register
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 border rounded focus:ring-2 focus:ring-ocean-blue-500"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

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
          Register
        </button>
      </form>

      <p className="mt-4 text-sm">
        Already have an account?{" "}
        <Link to="/login" className="text-ocean-blue-600">
          Login
        </Link>
      </p>
    </div>
  );
};