"use client";

import { AuthUser } from "@/types/auth";
import {
  getMe,
  login as apiLogin,
  signup as apiSignup,
  logout as apiLogout,
} from "@/utils/authService";
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
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextState | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      setIsLoading(true);

      const currentUser = await getMe();

      setUser(currentUser);
      setError(null);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setError(null);

      await apiLogin(email, password);

      await fetchUser();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to log in";
      setError(message);
      throw error;
    }
  };

  const signup = async (email: string, password: string): Promise<void> => {
    try {
      setError(null);

      await apiSignup(email, password);

      await fetchUser();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to sign up";
      setError(message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await apiLogout();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to log out";
      setError(message);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, error, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
