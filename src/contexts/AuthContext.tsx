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
  login: (email: string, password: string) => Promise<void | string>;
  signup: (email: string, password: string) => Promise<void | string>;
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
    } catch (error) {
      setUser(null);
      setError(null);
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
      setError(null);

      const result = await apiLogin(email, password);

      if (result !== true) {
        return result;
      }

      await fetchUser();
    } catch (error) {
      return "Failed to log in";
    }
  };

  const signup = async (
    email: string,
    password: string,
  ): Promise<void | string> => {
    try {
      setError(null);

      const result = await apiSignup(email, password);

      if (result !== true) {
        return result;
      }

      await fetchUser();
    } catch (error) {
      return "Failed to sign up";
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
    } finally {
      setUser(null);
      setError(null);
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