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
import Register from "./pages/Register"; // Import Register
import CommandCenter from "./pages/CommandCenter";
import Facilities from "./pages/Facilities";
import Interoperability from "./pages/Interoperability";
import DataQuality from "./pages/DataQuality";
import Developer from "./pages/Developer";
import Governance from "./pages/Governance";
import Audit from "./pages/Audit";
import SystemHealth from "./pages/SystemHealth";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";

const queryClient = new QueryClient();

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
            <Route path="/register" element={<Register />} /> {/* Add Register Route */}
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected Routes Group */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                {/* MoH Routes (Full Access) */}
                <Route path="/dashboard" element={<CommandCenter />} />
                <Route path="/facilities" element={<Facilities />} />
                <Route path="/interoperability" element={<Interoperability />} />
                <Route path="/data-quality" element={<DataQuality />} />
                <Route path="/governance" element={<Governance />} />
                <Route path="/audit" element={<Audit />} />
                <Route path="/health" element={<SystemHealth />} />
                
                {/* Developer Routes */}
                <Route path="/developer" element={<Developer />} /> 
                
                {/* Role-specific Dashboards (using existing pages as placeholders for now) */}
                <Route path="/facility-dashboard" element={<CommandCenter />} /> 
                <Route path="/developer-dashboard" element={<Developer />} /> 
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