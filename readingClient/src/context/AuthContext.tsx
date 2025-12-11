import { createContext, useContext, useState, ReactNode } from "react";
import { generateMockAvatar } from "../utils/mockAvatar";
import { User } from "../types/user.types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loginUser: (user: User, token: string) => void;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const safeParse = <T,>(value: string | null): T | null => {
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  };

  const [user, setUser] = useState<User | null>(() => {
    const stored = safeParse<User>(localStorage.getItem("user"));
    if (!stored) return null;

    return {
      ...stored,
      avatarUrl: stored.avatarUrl || generateMockAvatar(stored.username),
    };
  });

  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token") ?? null
  );

  const loginUser = (user: User, token: string) => {
    const finalUser = {
      ...user,
      avatarUrl: user.avatarUrl || generateMockAvatar(user.username),
    };

    setUser(finalUser);
    setToken(token);

    localStorage.setItem("user", JSON.stringify(finalUser));
    localStorage.setItem("token", token);

    console.log("User logged in:", finalUser);
  };

  const logoutUser = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};