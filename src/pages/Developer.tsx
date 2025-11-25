import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Key, Plus, Book, Code2, Webhook } from "lucide-react";
import { toast } from "sonner";
import { SandboxConsole } from "@/components/developer/SandboxConsole";
import { useEffect } from "react";

const apiKeys = [
  { id: 1, name: "Production Key - EMR Integration", key: "hkit_prod_abc123...", created: "2024-11-01", lastUsed: "2 min ago", status: "active" },
  { id: 2, name: "Sandbox Key - Testing", key: "hkit_test_xyz789...", created: "2024-10-15", lastUsed: "1 hour ago", status: "active" },
];

const webhooks = [
  { id: 1, url: "https://emr.hospital.com/webhooks/fhir", events: ["patient.created", "encounter.updated"], status: "active" },
  { id: 2, url: "https://api.integration.com/receive", events: ["observation.created"], status: "active" },
];

const samplePayload = `{
  "resourceType": "Patient",
  "id": "example-patient-001",
  "identifier": [{
    "system": "https://hkit.kwara.gov.ng/patient-id",
    "value": "KW2024001234"
  }],
  "active": true,
  "name": [{
    "use": "official",
    "family": "Adebayo",
    "given": ["Oluwaseun", "Temitope"]
  }],
  "gender": "male",
  "birthDate": "1985-03-15",
  "address": [{
    "use": "home",
    "city": "Ilorin",
    "state": "Kwara",
    "country": "Nigeria"
  }],
  "telecom": [{
    "system": "phone",
    "value": "+234-803-123-4567"
  }]
}`;

const Developer = () => {
  useEffect(() => {
    document.title = "Developer Portal | Hkit Portal";
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const handleGenerateKey = () => {
    toast.info("Action: Generating new API key (Mock Action)");
  };

  const handleRevokeKey = (keyId: number) => {
    toast.warning(`Action: Revoking API key #${keyId} (Mock Action)`);
  };

  const handleAddWebhook = () => {
    toast.info("Action: Opening Add Webhook form (Mock Action)");
  };

  const handleEditWebhook = (webhookId: number) => {
    toast.info(`Action: Editing Webhook #${webhookId} (Mock Action)`);
  };

  const handleDeleteWebhook = (webhookId: number) => {
    toast.warning(`Action: Deleting Webhook #${webhookId} (Mock Action)`);
  };

  const handleViewDocs = (title: string) => {
    toast.info(`Action: Navigating to Documentation: ${title}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Developer Portal</h1>
        <p className="text-muted-foreground">API keys, documentation, and integration tools</p>
      </div>

      <Tabs defaultValue="keys" className="w-full">
        <TabsList className="bg-secondary">
          <TabsTrigger value="keys">API Keys</TabsTrigger>
          <TabsTrigger value="docs">Documentation</TabsTrigger>
          <TabsTrigger value="sandbox">Sandbox</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>

        <TabsContent value="keys" className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Manage your API authentication keys</p>
            <Button className="bg-primary hover:bg-primary/90" onClick={handleGenerateKey}>
              <Plus className="w-4 h-4 mr-2" />
              Generate New Key
            </Button>
          </div>

          <div className="space-y-4">
            {apiKeys.map((key) => (
              <Card key={key.id} className="p-6 border-border">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Key className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-foreground">{key.name}</h3>
                      <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                        {key.status}
                      </Badge>
                    </div>
                    <div className="bg-secondary border border-border rounded-lg p-3 font-mono text-sm mb-3 flex items-center justify-between">
                      <span className="text-foreground">{key.key}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(key.key)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex gap-6 text-sm">
                      <span className="text-muted-foreground">Created: {key.created}</span>
                      <span className="text-muted-foreground">Last used: {key.lastUsed}</span>
                    </div>
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="border-destructive/50 ml-4"
                    onClick={() => handleRevokeKey(key.id)}
                  >
                    Revoke
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="docs" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card 
              className="p-6 border-border hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => handleViewDocs("Getting Started")}
            >
              <Book className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Getting Started</h3>
              <p className="text-sm text-muted-foreground">Learn the basics of Hkit API integration</p>
            </Card>
            <Card 
              className="p-6 border-border hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => handleViewDocs("FHIR Resources")}
            >
              <Code2 className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-2">FHIR Resources</h3>
              <p className="text-sm text-muted-foreground">Complete FHIR R4 resource documentation</p>
            </Card>
            <Card 
              className="p-6 border-border hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => handleViewDocs("Webhooks Guide")}
            >
              <Webhook className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Webhooks Guide</h3>
              <p className="text-sm text-muted-foreground">Real-time event subscriptions</p>
            </Card>
          </div>

          <Card className="mt-6 p-6 border-border">
            <h3 className="font-semibold text-foreground mb-4">Sample FHIR Patient Resource</h3>
            <div className="bg-secondary border border-border rounded-lg p-4 overflow-auto">
              <pre className="text-xs text-foreground font-mono">{samplePayload}</pre>
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                className="border-border"
                onClick={() => copyToClipboard(samplePayload)}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Payload
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="sandbox" className="mt-6">
          <Card className="p-6 border-border">
            <h3 className="font-semibold text-foreground mb-4">API Testing Console</h3>
            <SandboxConsole />
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Subscribe to real-time FHIR events</p>
            <Button className="bg-primary hover:bg-primary/90" onClick={handleAddWebhook}>
              <Plus className="w-4 h-4 mr-2" />
              Add Webhook
            </Button>
          </div>

          <div className="space-y-4">
            {webhooks.map((webhook) => (
              <Card key={webhook.id} className="p-6 border-border">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Webhook className="w-5 h-5 text-primary" />
                      <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                        {webhook.status}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-foreground mb-2">{webhook.url}</p>
                    <div className="flex gap-2 flex-wrap">
                      {webhook.events.map((event, i) => (
                        <Badge key={i} variant="outline" className="border-border">
                          {event}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-border"
                      onClick={() => handleEditWebhook(webhook.id)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="border-destructive/50"
                      onClick={() => handleDeleteWebhook(webhook.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Developer;