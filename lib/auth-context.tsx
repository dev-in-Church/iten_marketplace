"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import api from "@/lib/api";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: "customer" | "vendor" | "admin";
  avatarUrl?: string;
}

interface VendorProfile {
  id: string;
  store_name: string;
  store_description?: string;
  is_verified: boolean;
  commission_rate: number;
  total_sales: number;
  rating: number;
}

interface AuthContextType {
  user: User | null;
  vendor: VendorProfile | null;
  loading: boolean;
  login: (endpoint: string, data: Record<string, string>) => Promise<void>;
  register: (endpoint: string, data: Record<string, string>) => Promise<void>;
  googleLogin: (credential: string, role?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [vendor, setVendor] = useState<VendorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const data = await api.get<{ user: User; vendor: VendorProfile | null }>("/api/auth/me");
      setUser(data.user);
      setVendor(data.vendor);
    } catch {
      setUser(null);
      setVendor(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (endpoint: string, data: Record<string, string>) => {
    const res = await api.post<{ user: User; vendor?: VendorProfile }>(endpoint, data);
    setUser(res.user);
    if (res.vendor) setVendor(res.vendor);
  };

  const register = async (endpoint: string, data: Record<string, string>) => {
    const res = await api.post<{ user: User }>(endpoint, data);
    setUser(res.user);
  };

  const googleLogin = async (credential: string, role?: string) => {
    const res = await api.post<{ user: User }>("/api/auth/google", { credential, role });
    setUser(res.user);
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch {
      // ignore
    }
    setUser(null);
    setVendor(null);
  };

  return (
    <AuthContext.Provider value={{ user, vendor, loading, login, register, googleLogin, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
