import React, { createContext, useContext, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export type UserRole = "MoH" | "FacilityAdmin" | "Developer" | null;

interface User {
  id: string;
  name: string;
  role: UserRole;
  facility?: string;
}

interface AuthContextType {
  user: User | null;
  role: UserRole;
  login: (username: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS: Record<string, User> = {
  moh: { id: "1", name: "MoH Administrator", role: "MoH" },
  facility: { id: "2", name: "GH Ilorin Admin", role: "FacilityAdmin", facility: "General Hospital Ilorin" },
  developer: { id: "3", name: "EMR Vendor", role: "Developer" },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const login = (username: string) => {
    const lowerUsername = username.toLowerCase();
    const mockUser = MOCK_USERS[lowerUsername];

    if (mockUser) {
      setUser(mockUser);
      toast.success(`Welcome back, ${mockUser.name}!`);
      // Redirect based on role
      if (mockUser.role === "MoH") {
        navigate("/dashboard");
      } else if (mockUser.role === "FacilityAdmin") {
        navigate("/facility-dashboard");
      } else if (mockUser.role === "Developer") {
        navigate("/developer-dashboard");
      }
    } else {
      toast.error("Invalid credentials. Try 'moh', 'facility', or 'developer'.");
    }
  };

  const logout = () => {
    setUser(null);
    toast.info("You have been signed out.");
    navigate("/");
  };

  const role = user?.role || null;
  const isAuthenticated = !!user;

  const value = useMemo(() => ({
    user,
    role,
    login,
    logout,
    isAuthenticated,
  }), [user, role, isAuthenticated]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}