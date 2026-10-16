"use client";

import { getMe, login as apiLogin } from "@/utils/authService";
import {
  createContext,
  useState,
  useEffect,
  useContext,
  type ReactNode,
} from "react";

type AuthContextState = {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void | string>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextState | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me/`);
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data?.user as AuthUser | null);
        setError(null);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
      setError((err as Error).message ?? "Kunde inte hämta användare");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (
    email: string,
    password: string,
  ): Promise<void | string> => {
    try {
      const success = await apiLogin(email, password);
      if (!success) {
        return "Invalid credentials";
      }
      await fetchUser();
    } catch (e) {
      return "Failed to log in";
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider"); // ← Enligt lektionsmålet
  }
  return context;
};

export { AuthProvider, useAuth };
