import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Send, RefreshCw, CheckCircle2, XCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const MOCK_ENDPOINT = "https://api.hkit.kwara.gov.ng/fhir/Patient";

const initialRequestBody = `{
  "resourceType": "Patient",
  "name": [{
    "family": "Test",
    "given": ["Sandbox"]
  }]
}`;

const mockResponses = {
  success: {
    status: 201,
    body: JSON.stringify({
      resourceType: "OperationOutcome",
      issue: [{ severity: "information", code: "MSG_CREATED", details: { text: "Resource created successfully." } }],
      id: "sandbox-success-123",
    }, null, 2),
  },
  error: {
    status: 400,
    body: JSON.stringify({
      resourceType: "OperationOutcome",
      issue: [{ severity: "error", code: "INVALID_RESOURCE", details: { text: "Missing required identifier field." } }],
    }, null, 2),
  },
};

export function SandboxConsole() {
  const [endpoint, setEndpoint] = useState(MOCK_ENDPOINT);
  const [requestBody, setRequestBody] = useState(initialRequestBody);
  const [response, setResponse] = useState<typeof mockResponses.success | null>(null);
  const [isSending, setIsSending] = useState(false);

  const sendSandboxRequest = async () => {
    setIsSending(true);
    setResponse(null);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      JSON.parse(requestBody); // Check if JSON is valid
      
      // Simple mock logic: if body contains 'error' keyword, return error
      if (requestBody.toLowerCase().includes("error")) {
        setResponse(mockResponses.error);
        toast.error("Request Failed (400)", { description: "Check the response for validation issues." });
      } else {
        setResponse(mockResponses.success);
        toast.success("Request Successful (201)", { description: "Resource submitted to sandbox." });
      }
    } catch (e) {
      setResponse({
        status: 400,
        body: JSON.stringify({ error: "Invalid JSON payload" }, null, 2),
      });
      toast.error("Invalid Request", { description: "The request body is not valid JSON." });
    } finally {
      setIsSending(false);
    }
  };

  const handleClear = () => {
    setRequestBody(initialRequestBody);
    setResponse(null);
    setEndpoint(MOCK_ENDPOINT);
  };

  return (
    <CardContent className="p-0">
      <div className="space-y-6">
        <div>
          <Label htmlFor="endpoint" className="text-sm text-muted-foreground mb-2 block">Endpoint</Label>
          <Input
            id="endpoint"
            placeholder={MOCK_ENDPOINT}
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            className="bg-secondary border-border"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="requestBody" className="text-sm text-muted-foreground mb-2 block">Request Body (JSON)</Label>
            <textarea
              id="requestBody"
              className="w-full h-64 bg-secondary border border-border rounded-lg p-4 text-sm font-mono text-foreground resize-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
              placeholder="Enter FHIR resource JSON..."
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
            />
          </div>
          
          <div>
            <Label className="text-sm text-muted-foreground mb-2 block">Response</Label>
            <Card className="h-64 border-border bg-secondary/50">
              <ScrollArea className="h-full">
                <div className="p-4">
                  {response ? (
                    <>
                      <div className={`flex items-center gap-2 mb-2 font-semibold ${response.status >= 400 ? 'text-destructive' : 'text-success'}`}>
                        {response.status >= 400 ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                        Status: {response.status}
                      </div>
                      <pre className="text-xs font-mono whitespace-pre-wrap text-foreground">
                        {response.body}
                      </pre>
                    </>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      {isSending ? "Sending request..." : "Click 'Send Request' to test the API."}
                    </p>
                  )}
                </div>
              </ScrollArea>
            </Card>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={sendSandboxRequest} 
            disabled={isSending}
            className="bg-primary hover:bg-primary/90"
          >
            {isSending ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            {isSending ? "Sending..." : "Send Request"}
          </Button>
          <Button variant="outline" className="border-border" onClick={handleClear} disabled={isSending}>
            Clear
          </Button>
        </div>
      </div>
    </CardContent>
  );
}