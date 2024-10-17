"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";

interface User {
  id: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/check-auth`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setIsLoggedIn(true);
        setUser({ id: response.data.user.id, role: response.data.user.role });
      }
    } catch (error) {
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = (user: User) => {
    setIsLoggedIn(true);
    setUser(user);
  };

  const logout = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {}, { withCredentials: true });
      setIsLoggedIn(false);
      setUser(null);
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
