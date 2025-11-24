import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, role, isLoading } = useAuth();

  if (isLoading) {
    // Show a full-screen loading spinner while Supabase checks the session
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // User is not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // User is authenticated but does not have the required role
    // Note: If role is null (pending setup), the AuthProvider already redirects to /unauthorized
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}