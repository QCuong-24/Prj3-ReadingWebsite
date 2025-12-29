import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { JSX } from "react";

export const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  const isManager = user.roles.includes("ADMIN");

  if (!isManager) return <Navigate to="/" replace />;

  return children;
};