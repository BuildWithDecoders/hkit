import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import Landing from "./pages/Landing";
import CommandCenter from "./pages/CommandCenter";
import Facilities from "./pages/Facilities";
import Interoperability from "./pages/Interoperability";
import DataQuality from "./pages/DataQuality";
import Developer from "./pages/Developer";
import Governance from "./pages/Governance";
import Audit from "./pages/Audit";
import SystemHealth from "./pages/SystemHealth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<CommandCenter />} />
            <Route path="/facilities" element={<Facilities />} />
            <Route path="/interoperability" element={<Interoperability />} />
            <Route path="/data-quality" element={<DataQuality />} />
            <Route path="/developer" element={<Developer />} />
            <Route path="/governance" element={<Governance />} />
            <Route path="/audit" element={<Audit />} />
            <Route path="/health" element={<SystemHealth />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
