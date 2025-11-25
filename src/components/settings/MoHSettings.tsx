import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Database, Shield, Save } from "lucide-react";
import { toast } from "sonner";

export function MoHSettings() {
  const handleSaveSystemSettings = () => {
    toast.success("System settings saved.", { description: "Configuration changes applied." });
  };

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Database className="w-5 h-5" />
            Data Quality Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min-completeness">Minimum Completeness Threshold (%)</Label>
              <Input id="min-completeness" defaultValue="80" className="bg-secondary border-border" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="error-alert-limit">Daily Error Alert Limit</Label>
              <Input id="error-alert-limit" defaultValue="500" className="bg-secondary border-border" />
            </div>
          </div>
          <Button onClick={handleSaveSystemSettings} className="bg-primary hover:bg-primary/90">
            <Save className="w-4 h-4 mr-2" />
            Save Data Quality Settings
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security & Governance Defaults
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="default-consent-expiry">Default Consent Expiry (Months)</Label>
            <Input id="default-consent-expiry" defaultValue="12" className="bg-secondary border-border" />
          </div>
          <Button onClick={handleSaveSystemSettings} variant="outline" className="border-border">
            <Save className="w-4 h-4 mr-2" />
            Save Governance Defaults
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}