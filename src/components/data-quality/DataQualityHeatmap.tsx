import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Database } from "lucide-react";

const heatmapData = [
  { facility: "GH Ilorin", Patient: 98, Encounter: 95, Observation: 92, Medication: 90 },
  { facility: "Baptist Medical", Patient: 95, Encounter: 90, Observation: 88, Medication: 85 },
  { facility: "Sobi Hospital", Patient: 85, Encounter: 88, Observation: 91, Medication: 82 },
  { facility: "Private Clinic", Patient: 75, Encounter: 70, Observation: 78, Medication: 65 },
];

const resources = ["Patient", "Encounter", "Observation", "Medication"];

const getComplianceColor = (score: number) => {
  if (score >= 90) return "bg-success/20 text-success";
  if (score >= 80) return "bg-primary/20 text-primary";
  if (score >= 70) return "bg-warning/20 text-warning";
  return "bg-destructive/20 text-destructive";
};

export function DataQualityHeatmap() {
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
              {heatmapData.map((row, index) => (
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