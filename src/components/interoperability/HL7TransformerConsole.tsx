import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Code2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card"; // Added Card import

const initialHL7Input = `MSH|^~\\&|EMR_SYSTEM|FACILITY_ID|HKIT|KWARA|20241124100000||ADT^A01|MSG0001|P|2.5
PID|1||KW2024001234^^^SHID||DOE^JOHN^A||19800101|M|||
PV1|1|I|WARD^BED|||||||||||||||||20241124100000`;

const mockFHIRSuccess = `{
  "resourceType": "Bundle",
  "id": "bundle-success-123",
  "type": "message",
  "entry": [
    {
      "fullUrl": "urn:uuid:patient-1",
      "resource": {
        "resourceType": "Patient",
        "id": "patient-1",
        "identifier": [
          {
            "system": "https://hkit.kwara.gov.ng/shid",
            "value": "KW2024001234"
          }
        ],
        "name": [
          {
            "family": "DOE",
            "given": ["JOHN", "A"]
          }
        ],
        "gender": "male",
        "birthDate": "1980-01-01"
      }
    }
  ]
}`;

const mockFHIRError = `{
  "resourceType": "OperationOutcome",
  "issue": [
    {
      "severity": "error",
      "code": "required",
      "details": {
        "text": "Missing required segment: OBR (Observation Request)"
      },
      "location": ["MSH"]
    }
  ]
}`;

export function HL7TransformerConsole() {
  const [hl7Input, setHl7Input] = useState(initialHL7Input);
  const [fhirOutput, setFhirOutput] = useState(mockFHIRSuccess);
  const [isTransforming, setIsTransforming] = useState(false);
  const [status, setStatus] = useState<'success' | 'error' | 'idle'>('idle');

  const handleTransform = async () => {
    setIsTransforming(true);
    setFhirOutput("Processing...");
    setStatus('idle');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simple mock logic: if input contains 'OBR', assume success. If not, assume error.
    if (hl7Input.includes("OBR")) {
      setFhirOutput(mockFHIRSuccess);
      setStatus('success');
      toast.success("Transformation Successful", { description: "HL7 v2 message converted to FHIR R4 Bundle." });
    } else if (hl7Input.includes("ERROR")) {
      setFhirOutput(mockFHIRError);
      setStatus('error');
      toast.error("Transformation Failed", { description: "Validation errors found during conversion." });
    } else {
      setFhirOutput(mockFHIRSuccess);
      setStatus('success');
      toast.success("Transformation Successful", { description: "HL7 v2 message converted to FHIR R4 Bundle." });
    }

    setIsTransforming(false);
  };
  
  const handleClear = () => {
    setHl7Input(initialHL7Input);
    setFhirOutput("");
    setStatus('idle');
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2">HL7 v2 Input</h4>
          <textarea
            placeholder="Paste your HL7 v2 message here..."
            className="flex min-h-[300px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-secondary border-border font-mono text-xs resize-none"
            value={hl7Input}
            onChange={(e) => setHl7Input(e.target.value)}
            disabled={isTransforming}
          />
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
            FHIR R4 Output
            {status === 'success' && <CheckCircle2 className="w-4 h-4 text-success" />}
            {status === 'error' && <XCircle className="w-4 h-4 text-destructive" />}
          </h4>
          <Card className="h-[300px] border-border bg-secondary/50">
            <ScrollArea className="h-full">
              <div className="p-4">
                <pre className={`text-xs font-mono whitespace-pre-wrap ${status === 'error' ? 'text-destructive' : 'text-foreground'}`}>
                  {fhirOutput}
                </pre>
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>
      
      <div className="mt-4 flex justify-end gap-3">
        <Button variant="outline" className="border-border" onClick={handleClear} disabled={isTransforming}>
            Clear Console
        </Button>
        <Button 
          className="bg-primary hover:bg-primary/90" 
          onClick={handleTransform}
          disabled={isTransforming}
        >
          {isTransforming ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Code2 className="w-4 h-4 mr-2" />
          )}
          {isTransforming ? "Transforming..." : "Transform & Validate"}
        </Button>
      </div>
    </div>
  );
}