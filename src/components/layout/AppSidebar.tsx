import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Network,
  Database,
  Code2,
  Shield,
  ScrollText,
  Activity,
  LogOut,
  Users,
  Key,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth, UserRole } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

interface MenuItem {
  title: string;
  url: string;
  icon: React.ElementType;
}

const MoH_MENU: MenuItem[] = [
  { title: "Command Center", url: "/dashboard", icon: LayoutDashboard },
  { title: "Facility Registry", url: "/facilities", icon: Building2 },
  { title: "Interoperability", url: "/interoperability", icon: Network },
  { title: "System Health", url: "/health", icon: Activity },
  // Removed Data Quality, Consent & Identity, Audit Logs, and Developer Portal for a cleaner MoH focus.
];

const FACILITY_ADMIN_MENU: MenuItem[] = [
  { title: "Facility Dashboard", url: "/facility-dashboard", icon: Building2 }, // Changed icon
  { title: "Data Quality Score", url: "/data-quality", icon: Database },
  { title: "API & Integrations", url: "/developer", icon: Key },
  { title: "User Management", url: "/governance", icon: Users },
  { title: "Facility Audit Logs", url: "/audit", icon: ScrollText },
];

const DEVELOPER_MENU: MenuItem[] = [
  { title: "Developer Dashboard", url: "/developer-dashboard", icon: LayoutDashboard },
  { title: "Developer Portal", url: "/developer", icon: Code2 }, // Consolidated links
  { title: "API Logs & Analytics", url: "/audit", icon: ScrollText },
];

const getMenuItems = (role: UserRole): MenuItem[] => {
  switch (role) {
    case "MoH":
      return MoH_MENU;
    case "FacilityAdmin":
      return FACILITY_ADMIN_MENU;
    case "Developer":
      return DEVELOPER_MENU;
    default:
      return [];
  }
};

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const { role, logout, user } = useAuth();

  const menuItems = getMenuItems(role);

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent>
        <div className="px-4 py-6 border-b border-border">
          <div className="flex items-center justify-center">
            <img 
              src="/Hkit.png" 
              alt="Hkit Logo" 
              className="h-8 w-auto"
            />
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">
            {role === "MoH" ? "Oversight" : user?.facility || user?.name}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        {open && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      {/* Logout Button at the bottom */}
      <div className="p-4 border-t border-border">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={logout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          {open && <span>Sign Out</span>}
        </Button>
      </div>
    </Sidebar>
  );
}