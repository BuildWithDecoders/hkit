import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download, XCircle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { FhirEvent } from "@/api/hkit";

interface MessageInspectorDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  messageData: {
    id: number;
    status: FhirEvent['status'];
    resource: string;
    rawPayload: string;
    fhirOutput: string;
    validationErrors: string[];
  } | null;
}

export function MessageInspectorDialog({ isOpen, onOpenChange, messageData }: MessageInspectorDialogProps) {
  if (!messageData) return null;
    
  const { id, status, resource, rawPayload, fhirOutput, validationErrors } = messageData;

  const statusColor =
    status === "success"
      ? "bg-success/10 text-success border-success/20"
      : status === "failed"
      ? "bg-destructive/10 text-destructive border-destructive/20"
      : "bg-warning/10 text-warning border-warning/20";

  const handleRetry = () => {
    // Conceptual retry logic
    console.log(`Retrying message ${id}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            Message Inspector: {resource} #{id}
            <Badge variant="outline" className={statusColor}>
              {status}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Detailed view of the data payload, transformation, and validation results.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="raw" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="w-full grid grid-cols-3 bg-secondary">
            <TabsTrigger value="raw">Raw Payload</TabsTrigger>
            <TabsTrigger value="fhir">FHIR Output</TabsTrigger>
            <TabsTrigger value="validation">Validation ({validationErrors.length})</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 mt-4">
            <TabsContent value="raw" className="mt-0">
              <pre className="bg-secondary border border-border rounded-lg p-4 text-xs font-mono text-foreground whitespace-pre-wrap">
                {rawPayload}
              </pre>
            </TabsContent>

            <TabsContent value="fhir" className="mt-0">
              <pre className="bg-secondary border border-border rounded-lg p-4 text-xs font-mono text-foreground whitespace-pre-wrap">
                {fhirOutput}
              </pre>
            </TabsContent>

            <TabsContent value="validation" className="mt-0 space-y-3">
              {validationErrors.length > 0 ? (
                validationErrors.map((error, index) => (
                  <div key={index} className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3">
                    <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-destructive" />
                    <span className="text-sm text-destructive">{error}</span>
                  </div>
                ))
              ) : (
                <div className="p-6 rounded-lg bg-success/10 border border-success/20 text-center">
                  <CheckCircle2 className="w-6 h-6 text-success mx-auto mb-2" />
                  <p className="text-sm text-success">Validation successful. No issues found.</p>
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <div className="flex justify-end gap-3 border-t border-border pt-4">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Message
          </Button>
          {status === "failed" && (
            <Button className="bg-primary hover:bg-primary/90" onClick={handleRetry}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry Submission
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}