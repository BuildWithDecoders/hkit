import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Code2, Key, Save, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export function DeveloperSettings() {
  const handleSaveWebhookSettings = () => {
    toast.success("Webhook settings saved.", { description: "Default retry policy updated." });
  };
  
  const handleRotateAllKeys = () => {
    toast.warning("All API keys rotated.", { description: "New keys generated and old keys deactivated." });
  };

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Key className="w-5 h-5" />
            API Key Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Manage security policies for your integration keys.</p>
          <div className="space-y-2">
            <Label htmlFor="key-expiry">Default Key Expiry (Days)</Label>
            <Input id="key-expiry" defaultValue="90" className="bg-secondary border-border" />
          </div>
          <Button onClick={handleRotateAllKeys} variant="destructive" className="border-destructive/50">
            <RefreshCw className="w-4 h-4 mr-2" />
            Rotate All Active Keys
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Code2 className="w-5 h-5" />
            Webhook Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-retry">Webhook Retry Attempts</Label>
            <Input id="webhook-retry" defaultValue="5" className="bg-secondary border-border" />
          </div>
          <Button onClick={handleSaveWebhookSettings} variant="outline" className="border-border">
            <Save className="w-4 h-4 mr-2" />
            Save Webhook Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}