import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Session, User as SupabaseUser } from "@supabase/supabase-js";

export type UserRole = "MoH" | "FacilityAdmin" | "Developer" | null;

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  facilityId?: number;
  facilityName?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to fetch profile and facility data with retry logic
async function fetchUserProfile(supabaseUser: SupabaseUser): Promise<UserProfile | null> {
  let profileData = null;
  let attempts = 0;
  const maxAttempts = 5; // Increased attempts for robustness against race conditions

  while (attempts < maxAttempts) {
    const { data, error } = await supabase
      .from('profiles')
      .select('role, facility_id, first_name, last_name')
      .eq('id', supabaseUser.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is 'No rows found'
      console.error(`Error fetching profile (Attempt ${attempts + 1}):`, error);
      break;
    }
    
    if (data && data.role) {
      profileData = data;
      break; // Found profile with role, success!
    }
    
    if (attempts < maxAttempts - 1) {
      // Wait a bit before retrying if profile is missing or role is null
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    attempts++;
  }
  
  if (!profileData) {
    // If profile still not found or role is null after retries, return basic info
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: supabaseUser.email || 'User',
      role: null,
    };
  }

  const firstName = profileData.first_name || '';
  const lastName = profileData.last_name || '';
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || supabaseUser.email || 'User';
  const role = (profileData.role as UserRole) || null;
  const facilityId = profileData.facility_id;
  let facilityName: string | undefined;

  if (facilityId) {
    const { data: facilityData } = await supabase
      .from('facilities')
      .select('name')
      .eq('id', facilityId)
      .single();
    facilityName = facilityData?.name;
  }

  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: fullName,
    role: role,
    facilityId: facilityId,
    facilityName: facilityName,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Initial Load and Auth State Listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      setSession(currentSession);
      
      if (currentSession?.user) {
        const profile = await fetchUserProfile(currentSession.user);
        setUser(profile);
        
        // Redirect logic after sign-in
        if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
          const currentPath = location.pathname;
          // Only redirect if the user is on a public/unauthorized entry point
          const isPublicPath = currentPath === '/' || currentPath === '/login' || currentPath === '/register' || currentPath === '/moh-setup' || currentPath === '/unauthorized';

          if (profile?.role === "MoH" && isPublicPath) {
            navigate("/moh/dashboard", { replace: true });
          } else if (profile?.role === "FacilityAdmin" && isPublicPath) {
            navigate("/facility/dashboard", { replace: true });
          } else if (profile?.role === "Developer" && isPublicPath) {
            navigate("/developer/dashboard", { replace: true });
          } else if (profile?.role === null && currentPath !== '/register') {
            // User signed up but role/facility is pending approval/setup
            toast.info("Your account is pending setup or approval.");
            navigate("/unauthorized", { replace: true });
          }
        }
      } else {
        setUser(null);
        // Redirect to login if trying to access any protected route without a session
        if (location.pathname.includes('/moh') || location.pathname.includes('/facility') || location.pathname.includes('/developer') || location.pathname.includes('/admin') || location.pathname.includes('/shared')) {
            navigate("/login", { replace: true });
        }
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname]);

  // 2. Login Function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error("Login Failed", {
        description: error.message,
      });
      setIsLoading(false);
    }
    // Success handled by onAuthStateChange listener
  };

  // 3. Logout Function
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Logout Failed", {
        description: error.message,
      });
    } else {
      toast.info("You have been signed out.");
      navigate("/login", { replace: true });
    }
  };

  const role = user?.role || null;
  const isAuthenticated = !!user;

  const value = useMemo(() => ({
    user,
    role,
    login,
    logout,
    isAuthenticated,
    isLoading,
  }), [user, role, isAuthenticated, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}