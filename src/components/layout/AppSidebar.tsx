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

const menuItems = [
  { title: "Command Center", url: "/dashboard", icon: LayoutDashboard },
  { title: "Facility Registry", url: "/facilities", icon: Building2 },
  { title: "Interoperability", url: "/interoperability", icon: Network },
  { title: "Data Quality", url: "/data-quality", icon: Database },
  { title: "Developer Portal", url: "/developer", icon: Code2 },
  { title: "Consent & Identity", url: "/governance", icon: Shield },
  { title: "Audit Logs", url: "/audit", icon: ScrollText },
  { title: "System Health", url: "/health", icon: Activity },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent>
        <div className="px-4 py-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_15px_hsl(var(--primary-glow)/0.5)]">
              <Activity className="w-5 h-5 text-primary-foreground" />
            </div>
            {open && (
              <div>
                <h2 className="font-bold text-lg text-foreground">Hkit</h2>
                <p className="text-xs text-muted-foreground">Health Infrastructure</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">Navigation</SidebarGroupLabel>
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
    </Sidebar>
  );
}
