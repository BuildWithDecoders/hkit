import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Server, Mail, Save } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

export function FacilitySettings() {
  const { user } = useAuth();
  const facilityName = user?.facilityName || "Your Facility";

  const handleSaveIntegrationSettings = () => {
    toast.success("Integration settings saved.", { description: "EMR connection details updated." });
  };

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Server className="w-5 h-5" />
            EMR Integration Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Configure the connection details for {facilityName}'s EMR system.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emr-system">EMR System Name</Label>
              <Input id="emr-system" defaultValue="OpenMRS" className="bg-secondary border-border" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fhir-endpoint">FHIR Endpoint URL</Label>
              <Input id="fhir-endpoint" defaultValue="https://emr.ghilorin.com/fhir/r4" className="bg-secondary border-border" />
            </div>
          </div>
          <Button onClick={handleSaveIntegrationSettings} className="bg-primary hover:bg-primary/90">
            <Save className="w-4 h-4 mr-2" />
            Save Integration Settings
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Set up alerts for failed submissions and low data quality scores.</p>
          {/* Placeholder for notification toggles */}
          <Button variant="outline" className="border-border">
            Configure Alerts (Mock)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}