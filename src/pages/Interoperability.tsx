import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, XCircle, AlertTriangle, RefreshCw, Eye } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const fhirEvents = [
  { id: 1, resource: "Patient", operation: "CREATE", facility: "General Hospital Ilorin", status: "success", timestamp: "2024-11-23 14:23:45" },
  { id: 2, resource: "Observation", operation: "UPDATE", facility: "Baptist Medical Centre", status: "success", timestamp: "2024-11-23 14:23:42" },
  { id: 3, resource: "Encounter", operation: "CREATE", facility: "Sobi Specialist Hospital", status: "failed", timestamp: "2024-11-23 14:23:38" },
  { id: 4, resource: "MedicationRequest", operation: "CREATE", facility: "General Hospital Ilorin", status: "success", timestamp: "2024-11-23 14:23:35" },
  { id: 5, resource: "Condition", operation: "UPDATE", facility: "Private Clinic Offa", status: "warning", timestamp: "2024-11-23 14:23:30" },
];

const validationIssues = [
  { id: 1, message: "Missing required field: patient.identifier", resource: "Patient", facility: "General Hospital", severity: "error" },
  { id: 2, message: "Invalid date format in effectiveDateTime", resource: "Observation", facility: "Baptist Medical", severity: "error" },
  { id: 3, message: "Coding system not recognized", resource: "Condition", facility: "Sobi Hospital", severity: "warning" },
];

const Interoperability = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Interoperability Monitor</h1>
        <p className="text-muted-foreground">Track FHIR and HL7 data exchange in real-time</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Events</p>
              <p className="text-2xl font-bold text-foreground mt-1">45,234</p>
            </div>
            <RefreshCw className="w-8 h-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4 border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Successful</p>
              <p className="text-2xl font-bold text-success mt-1">44,891</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
        </Card>
        <Card className="p-4 border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Failed</p>
              <p className="text-2xl font-bold text-destructive mt-1">127</p>
            </div>
            <XCircle className="w-8 h-8 text-destructive" />
          </div>
        </Card>
        <Card className="p-4 border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Warnings</p>
              <p className="text-2xl font-bold text-warning mt-1">216</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-warning" />
          </div>
        </Card>
      </div>

      <Tabs defaultValue="stream" className="w-full">
        <TabsList className="bg-secondary">
          <TabsTrigger value="stream">Event Stream</TabsTrigger>
          <TabsTrigger value="validation">Validation Issues</TabsTrigger>
          <TabsTrigger value="transformer">HL7 Transformer</TabsTrigger>
        </TabsList>

        <TabsContent value="stream" className="mt-6">
          <Card className="border-border">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Live FHIR Event Stream</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">Live</span>
              </div>
            </div>
            <ScrollArea className="h-[500px]">
              <div className="p-4 space-y-2">
                {fhirEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <Badge
                        variant="outline"
                        className={
                          event.status === "success"
                            ? "bg-success/10 text-success border-success/20"
                            : event.status === "failed"
                            ? "bg-destructive/10 text-destructive border-destructive/20"
                            : "bg-warning/10 text-warning border-warning/20"
                        }
                      >
                        {event.status}
                      </Badge>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {event.resource} - {event.operation}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{event.facility}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{event.timestamp}</span>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>

        <TabsContent value="validation" className="mt-6">
          <Card className="border-border">
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold text-foreground">Validation Errors & Warnings</h3>
            </div>
            <div className="p-4 space-y-3">
              {validationIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="p-4 rounded-lg bg-secondary border border-border"
                >
                  <div className="flex items-start gap-3">
                    {issue.severity === "error" ? (
                      <XCircle className="w-5 h-5 text-destructive mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{issue.message}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-muted-foreground">Resource: {issue.resource}</span>
                        <span className="text-xs text-muted-foreground">Facility: {issue.facility}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="border-border">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="transformer" className="mt-6">
          <Card className="border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">HL7 to FHIR Transformer</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">HL7 v2 Input</h4>
                <div className="bg-secondary border border-border rounded-lg p-4 font-mono text-xs text-foreground h-64 overflow-auto">
                  MSH|^~\&|SENDING_APP|SENDING_FAC|RECEIVING_APP|...
                  <br />
                  PID|1||12345^^^MRN||DOE^JOHN^A||19800101|M|||...
                  <br />
                  OBR|1|12345|67890|CBC^Complete Blood Count...
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">FHIR R4 Output</h4>
                <div className="bg-secondary border border-border rounded-lg p-4 font-mono text-xs text-foreground h-64 overflow-auto">
                  {`{
  "resourceType": "Patient",
  "id": "12345",
  "identifier": [{
    "system": "MRN",
    "value": "12345"
  }],
  "name": [{
    "family": "DOE",
    "given": ["JOHN", "A"]
  }],
  "gender": "male",
  "birthDate": "1980-01-01"
}`}
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button className="bg-primary hover:bg-primary/90">
                Transform & Validate
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Interoperability;
