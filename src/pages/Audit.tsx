import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Filter } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const auditLogs = [
  { id: 1, timestamp: "2024-11-23 14:25:30", user: "admin@moh.kwara", action: "FACILITY_APPROVED", resource: "Baptist Medical Centre", ip: "102.89.23.45", status: "success" },
  { id: 2, timestamp: "2024-11-23 14:23:15", user: "api_key_abc123", action: "PATIENT_CREATED", resource: "Patient/KW2024001234", ip: "41.203.12.88", status: "success" },
  { id: 3, timestamp: "2024-11-23 14:20:42", user: "facility_admin@hospital", action: "API_KEY_GENERATED", resource: "hkit_prod_xyz789", ip: "197.210.55.10", status: "success" },
  { id: 4, timestamp: "2024-11-23 14:18:08", user: "api_key_test456", action: "OBSERVATION_UPDATE", resource: "Observation/obs-12345", ip: "105.112.45.22", status: "failed" },
  { id: 5, timestamp: "2024-11-23 14:15:33", user: "admin@moh.kwara", action: "CONSENT_REVOKED", resource: "Consent/consent-789", ip: "102.89.23.45", status: "success" },
  { id: 6, timestamp: "2024-11-23 14:12:51", user: "api_key_prod999", action: "ENCOUNTER_CREATED", resource: "Encounter/enc-54321", ip: "197.255.88.99", status: "success" },
];

const Audit = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Audit Logs</h1>
        <p className="text-muted-foreground">Complete system activity and accountability trail</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-border">
          <p className="text-sm text-muted-foreground mb-1">Total Events (24h)</p>
          <p className="text-2xl font-bold text-foreground">12,456</p>
        </Card>
        <Card className="p-4 border-border">
          <p className="text-sm text-muted-foreground mb-1">Successful</p>
          <p className="text-2xl font-bold text-success">12,289</p>
        </Card>
        <Card className="p-4 border-border">
          <p className="text-sm text-muted-foreground mb-1">Failed</p>
          <p className="text-2xl font-bold text-destructive">167</p>
        </Card>
        <Card className="p-4 border-border">
          <p className="text-sm text-muted-foreground mb-1">Unique Users</p>
          <p className="text-2xl font-bold text-foreground">248</p>
        </Card>
      </div>

      <Card className="p-6 border-border">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search logs by user, action, or resource..."
              className="pl-10 bg-secondary border-border"
            />
          </div>
          <Button variant="outline" className="border-border">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" className="border-border">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        <ScrollArea className="h-[600px]">
          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-4 rounded-lg bg-secondary border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <Badge
                    variant="outline"
                    className={
                      log.status === "success"
                        ? "bg-success/10 text-success border-success/20"
                        : "bg-destructive/10 text-destructive border-destructive/20"
                    }
                  >
                    {log.status}
                  </Badge>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-sm font-medium text-foreground">{log.action}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{log.resource}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>User: {log.user}</span>
                      <span>IP: {log.ip}</span>
                      <span>{log.timestamp}</span>
                    </div>
                  </div>
                </div>
                <Button size="sm" variant="ghost">
                  Details
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default Audit;
