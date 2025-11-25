import React, { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { MoHSettings } from "@/components/settings/MoHSettings";
import { FacilitySettings } from "@/components/settings/FacilitySettings";
import { DeveloperSettings } from "@/components/settings/DeveloperSettings";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Settings as SettingsIcon } from "lucide-react";

const Settings = () => {
  const { role, user } = useAuth();

  useEffect(() => {
    document.title = "System Settings | Hkit Portal";
  }, []);

  const renderSettingsContent = () => {
    switch (role) {
      case "MoH":
        return <MoHSettings />;
      case "FacilityAdmin":
        return <FacilitySettings />;
      case "Developer":
        return <DeveloperSettings />;
      default:
        return (
          <Card className="p-8 border-destructive/20 bg-destructive/10 text-center">
            <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-3" />
            <p className="text-destructive">Access Denied: Unknown or unapproved role.</p>
          </Card>
        );
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">System Settings</h1>
        <p className="text-muted-foreground">
          Configure system-wide parameters and role-specific integration details.
        </p>
      </div>
      
      {renderSettingsContent()}
    </div>
  );
};

export default Settings;