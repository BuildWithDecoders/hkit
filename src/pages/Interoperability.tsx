import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, XCircle, AlertTriangle, RefreshCw, Eye, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFhirEvents, useCommandCenterMetrics, useLiveErrorFeed } from "@/hooks/use-hkit-data";
import { useState, useEffect } from "react";
import { MessageInspectorDialog } from "@/components/interoperability/MessageInspectorDialog";
import { getMockMessageDetails, FhirEvent } from "@/api/hkit";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const Interoperability = () => {
  const { data: fhirEvents, isLoading: isLoadingEvents, isError: isErrorEvents } = useFhirEvents();
  const { data: metrics, isLoading: isLoadingMetrics } = useCommandCenterMetrics();
  const { data: validationErrors, isLoading: isLoadingValidation, isError: isErrorValidation } = useLiveErrorFeed();
  
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    document.title = "Interoperability Monitor | Hkit Portal";
  }, []);

  const handleViewDetails = (event: FhirEvent) => {
    // Use the mock details function which simulates fetching details based on ID
    const details = getMockMessageDetails(event.id);
    if (details) {
      setSelectedMessage(details);
      setIsInspectorOpen(true);
    }
  };

  const handleViewValidationDetails = (issueId: number) => {
    // In a real app, this would fetch the full audit log details
    toast.info(`Action: Viewing detailed validation report for log ID #${issueId}`);
  };

  const handleTransformValidate = () => {
    toast.info("Action: Running HL7 transformation and validation (Mock Action)");
  };
  
  const totalEvents = metrics?.totalEvents24h || 0;
  const successRate = metrics?.successRate || 0;
  const failedEvents = validationErrors?.length || 0; // Use actual failed count from live error feed
  const successfulEvents = totalEvents - failedEvents;
  // Warning count is mocked as we don't have a direct metric for it yet
  const warningEvents = 216; 

  const renderEventStream = () => {
    if (isLoadingEvents) {
      return (
        <div className="p-4 space-y-2">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="p-4 border-border">
              <Skeleton className="h-6 w-full" />
            </Card>
          ))}
        </div>
      );
    }

    if (isErrorEvents || !fhirEvents) {
      return (
        <div className="p-4 text-center text-destructive">
          <AlertTriangle className="w-6 h-6 mx-auto mb-2" />
          Failed to load FHIR event stream.
        </div>
      );
    }

    return (
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
            <Button size="sm" variant="ghost" onClick={() => handleViewDetails(event)}>
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    );
  };
  
  const renderValidationIssues = () => {
    if (isLoadingValidation) {
      return (
        <div className="p-4 text-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
          Loading validation errors...
        </div>
      );
    }
    
    if (isErrorValidation || !validationErrors) {
      return (
        <div className="p-4 text-center text-destructive">
          <AlertTriangle className="w-6 h-6 mx-auto mb-2" />
          Failed to load validation issues.
        </div>
      );
    }
    
    if (validationErrors.length === 0) {
      return (
        <div className="p-6 rounded-lg bg-success/10 border border-success/20 text-center">
          <CheckCircle2 className="w-6 h-6 text-success mx-auto mb-2" />
          <p className="text-sm text-success">No recent validation errors found (24h).</p>
        </div>
      );
    }

    return (
      <div className="p-4 space-y-3">
        {validationErrors.map((issue) => (
          <div
            key={issue.id}
            className="p-4 rounded-lg bg-secondary border border-border"
          >
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {issue.facilityName || 'System'} - {issue.resource}
                </p>
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  Action: {issue.action} | Details: {issue.details ? JSON.stringify(issue.details).substring(0, 100) : 'N/A'}...
                </p>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="border-border flex-shrink-0"
                onClick={() => handleViewValidationDetails(issue.id)}
              >
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Interoperability Monitor</h1>
        <p className="text-muted-foreground">Track FHIR and HL7 data exchange in real-time</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Events</p>
              <p className="text-2xl font-bold text-foreground mt-1">{isLoadingMetrics ? <Loader2 className="w-6 h-6 animate-spin" /> : totalEvents.toLocaleString()}</p>
            </div>
            <RefreshCw className="w-8 h-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4 border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Successful</p>
              <p className="text-2xl font-bold text-success mt-1">{isLoadingMetrics ? <Loader2 className="w-6 h-6 animate-spin" /> : successfulEvents.toLocaleString()}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
        </Card>
        <Card className="p-4 border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Failed</p>
              <p className="text-2xl font-bold text-destructive">{isLoadingValidation ? <Loader2 className="w-6 h-6 animate-spin" /> : failedEvents.toLocaleString()}</p>
            </div>
            <XCircle className="w-8 h-8 text-destructive" />
          </div>
        </Card>
        <Card className="p-4 border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
              <p className="text-2xl font-bold text-warning">{isLoadingMetrics ? <Loader2 className="w-6 h-6 animate-spin" /> : `${successRate}%`}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-warning" />
          </div>
        </Card>
      </div>

      <Tabs defaultValue="stream" className="w-full">
        <TabsList className="bg-secondary">
          <TabsTrigger value="stream">Event Stream</TabsTrigger>
          <TabsTrigger value="validation">Validation Issues ({failedEvents})</TabsTrigger>
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
              {renderEventStream()}
            </ScrollArea>
          </Card>
        </TabsContent>

        <TabsContent value="validation" className="mt-6">
          <Card className="border-border">
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold text-foreground">Recent Validation Errors (Last 24h)</h3>
            </div>
            <ScrollArea className="h-[500px]">
              {renderValidationIssues()}
            </ScrollArea>
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
              <Button className="bg-primary hover:bg-primary/90" onClick={handleTransformValidate}>
                Transform & Validate
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
      
      <MessageInspectorDialog 
        isOpen={isInspectorOpen}
        onOpenChange={setIsInspectorOpen}
        messageData={selectedMessage}
      />
    </div>
  );
};

export default Interoperability;