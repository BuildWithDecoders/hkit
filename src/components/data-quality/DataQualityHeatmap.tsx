import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Database, Loader2, AlertTriangle } from "lucide-react";
import { HeatmapRow } from "@/api/hkit";

const resources = ["Patient", "Encounter", "Observation", "Medication"];

const getComplianceColor = (score: number) => {
  if (score >= 90) return "bg-success/20 text-success";
  if (score >= 80) return "bg-primary/20 text-primary";
  if (score >= 70) return "bg-warning/20 text-warning";
  return "bg-destructive/20 text-destructive";
};

interface DataQualityHeatmapProps {
    data: HeatmapRow[];
    isLoading: boolean;
    isError: boolean;
}

export function DataQualityHeatmap({ data, isLoading, isError }: DataQualityHeatmapProps) {
  if (isLoading) {
    return (
      <Card className="p-6 border-border h-[400px] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </Card>
    );
  }
  
  if (isError) {
    return (
      <Card className="p-8 border-destructive/20 bg-destructive/10 text-center">
        <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-3" />
        <p className="text-destructive">Error loading heatmap data.</p>
      </Card>
    );
  }
  
  if (data.length === 0) {
    return (
      <Card className="p-8 border-border text-center bg-secondary/50">
        <Database className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">No resource compliance data available yet.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 border-border">
      <CardHeader className="p-0 mb-4">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Database className="w-5 h-5 text-primary" />
          Resource Compliance Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr className="border-b border-border text-left text-sm text-muted-foreground">
                <th className="py-3 px-2 font-medium w-1/4">Facility</th>
                {resources.map((res) => (
                  <th key={res} className="py-3 px-2 font-medium text-center">{res}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index} className="border-b border-border/50 last:border-b-0 hover:bg-secondary/50 transition-colors">
                  <td className="py-3 px-2 font-medium text-foreground text-sm">{row.facility}</td>
                  {resources.map((res) => {
                    const score = row[res as keyof typeof row] as number;
                    return (
                      <td key={res} className="py-2 px-2 text-center">
                        <div className={cn("rounded-md p-2 font-bold text-sm inline-block min-w-[60px]", getComplianceColor(score))}>
                          {score}%
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-4">Scores represent completeness percentage for key FHIR resources.</p>
      </CardContent>
    </Card>
  );
}