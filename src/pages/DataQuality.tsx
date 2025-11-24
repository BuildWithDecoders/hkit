import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, TrendingDown } from "lucide-react";
import { CompletenessTrendChart } from "@/components/data-quality/CompletenessTrendChart";
import { ErrorDistributionChart } from "@/components/data-quality/ErrorDistributionChart";
import { DataQualityHeatmap } from "@/components/data-quality/DataQualityHeatmap";
import { useAuth } from "@/hooks/use-auth";
import { mockFacilityScores } from "@/api/hkit";

const DataQuality = () => {
  const { role, user } = useAuth();
  const facilityName = user?.facility;

  const getTitle = () => {
    if (role === "FacilityAdmin") return `${facilityName || 'Your Facility'} Data Quality Score`;
    return "Data Quality Center";
  };

  const getDescription = () => {
    if (role === "FacilityAdmin") return "Monitor your facility's compliance with the Minimum Dataset Standard.";
    return "Monitor and enforce minimum dataset compliance";
  };

  const filteredFacilityScores = role === "FacilityAdmin"
    ? mockFacilityScores.filter(f => f.name === facilityName)
    : mockFacilityScores;

  const overallCompleteness = role === "FacilityAdmin"
    ? filteredFacilityScores[0]?.score || 0
    : 87.3; // MoH average

  const facilitiesMeetingMDS = role === "FacilityAdmin"
    ? (overallCompleteness >= 80 ? "1/1" : "0/1")
    : "94/118";

  const complianceRate = role === "FacilityAdmin"
    ? (overallCompleteness >= 80 ? "100%" : "0%")
    : "79.7% compliance rate";

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{getTitle()}</h1>
          <p className="text-muted-foreground">{getDescription()}</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 border-border">
          <p className="text-sm text-muted-foreground mb-2">Overall Completeness</p>
          <p className="text-3xl font-bold text-foreground mb-4">{overallCompleteness}%</p>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${overallCompleteness}%` }} />
          </div>
        </Card>
        <Card className="p-6 border-border">
          <p className="text-sm text-muted-foreground mb-2">Validation Errors (24h)</p>
          <p className="text-3xl font-bold text-destructive mb-2">{role === "FacilityAdmin" ? "12" : "342"}</p>
          <p className="text-sm text-muted-foreground">-15% from yesterday</p>
        </Card>
        <Card className="p-6 border-border">
          <p className="text-sm text-muted-foreground mb-2">Facilities Meeting MDS</p>
          <p className="text-3xl font-bold text-success mb-2">{facilitiesMeetingMDS}</p>
          <p className="text-sm text-muted-foreground">{complianceRate}</p>
        </Card>
      </div>

      {/* Heatmap is only relevant for MoH, so we hide it for Facility Admin */}
      {role === "MoH" && <DataQualityHeatmap />}

      <Card className="p-6 border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          {role === "FacilityAdmin" ? "Your Facility Score" : "Facility Completeness Scores"}
        </h3>
        <div className="space-y-4">
          {filteredFacilityScores.map((facility, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground">{facility.name}</span>
                  <div className="flex items-center gap-1">
                    {facility.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-success" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-destructive" />
                    )}
                    <span
                      className={`text-xs ${
                        facility.trend === "up" ? "text-success" : "text-destructive"
                      }`}
                    >
                      {facility.change}
                    </span>
                  </div>
                </div>
                <span className="text-sm font-semibold text-foreground">{facility.score}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    facility.score >= 90
                      ? "bg-success"
                      : facility.score >= 80
                      ? "bg-primary"
                      : facility.score >= 70
                      ? "bg-warning"
                      : "bg-destructive"
                  }`}
                  style={{ width: `${facility.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ErrorDistributionChart /> 
        <CompletenessTrendChart />
      </div>
    </div>
  );
};

export default DataQuality;