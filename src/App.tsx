import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AppLayout } from "./components/layout/AppLayout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CommandCenter from "./pages/CommandCenter";
import Facilities from "./pages/Facilities";
import FacilityDetails from "./pages/FacilityDetails";
import Interoperability from "./pages/Interoperability";
import DataQuality from "./pages/DataQuality";
import Developer from "./pages/Developer";
import Governance from "./pages/Governance";
import Audit from "./pages/Audit";
import SystemHealth from "./pages/SystemHealth";
import FacilityDashboard from "./pages/FacilityDashboard";
import DeveloperDashboard from "./pages/DeveloperDashboard";
import UserManagement from "./pages/UserManagement";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import MoHSignup from "./pages/MoHSignup";
import RegistrationRequests from "./pages/RegistrationRequests";
import ProfileSettings from "./pages/ProfileSettings";
import Settings from "./pages/Settings"; // Import new Settings page

const queryClient = new QueryClient();

// Define role constants for RBAC
const MoH_ROLES = ["MoH"];
const FACILITY_ROLES = ["FacilityAdmin"];
const DEVELOPER_ROLES = ["Developer"];
const SHARED_ROLES = ["MoH", "FacilityAdmin", "Developer"];
const MOH_FACILITY_ROLES = ["MoH", "FacilityAdmin"];

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/moh-setup" element={<MoHSignup />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Main Protected Route (Requires Authentication and provides AppLayout) */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                
                {/* MoH Routes (Full Access) */}
                <Route path="/moh" element={<ProtectedRoute allowedRoles={MoH_ROLES} />}>
                  <Route path="dashboard" element={<CommandCenter />} />
                  <Route path="facilities" element={<Facilities />} />
                  <Route path="facilities/:id" element={<FacilityDetails />} />
                  <Route path="interoperability" element={<Interoperability />} />
                  <Route path="health" element={<SystemHealth />} />
                  <Route path="users" element={<UserManagement />} />
                  <Route path="requests" element={<RegistrationRequests />} />
                </Route>

                {/* Facility Admin Routes */}
                <Route path="/facility" element={<ProtectedRoute allowedRoles={FACILITY_ROLES} />}>
                  <Route path="dashboard" element={<FacilityDashboard />} />
                </Route>

                {/* Developer Routes */}
                <Route path="/developer" element={<ProtectedRoute allowedRoles={DEVELOPER_ROLES} />}>
                  <Route path="dashboard" element={<DeveloperDashboard />} />
                  <Route path="portal" element={<Developer />} />
                </Route>

                {/* Shared Routes (Accessible by multiple roles) */}
                <Route path="/shared" element={<ProtectedRoute allowedRoles={SHARED_ROLES} />}>
                  <Route path="audit" element={<Audit />} />
                  {/* Developer portal is shared but also has a dedicated developer route */}
                  <Route path="developer-portal" element={<Developer />} /> 
                  <Route path="account" element={<ProfileSettings />} /> {/* Renamed Profile Route */}
                  <Route path="settings" element={<Settings />} /> {/* New Settings Route */}
                </Route>
                
                {/* Shared MoH/Facility Admin Routes */}
                <Route path="/admin" element={<ProtectedRoute allowedRoles={MOH_FACILITY_ROLES} />}>
                  <Route path="data-quality" element={<DataQuality />} />
                  <Route path="governance" element={<Governance />} />
                </Route>
                
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;