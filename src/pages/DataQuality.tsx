import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, TrendingDown, Loader2, AlertTriangle } from "lucide-react";
import { CompletenessTrendChart } from "@/components/data-quality/CompletenessTrendChart";
import { ErrorDistributionChart } from "@/components/data-quality/ErrorDistributionChart";
import { DataQualityHeatmap } from "@/components/data-quality/DataQualityHeatmap";
import { useAuth } from "@/hooks/use-auth";
import { useFacilityScores, useDataQualityHeatmap, useCompletenessTrend, useErrorDistribution } from "@/hooks/use-hkit-data";
import { Skeleton } from "@/components/ui/skeleton";

const DataQuality = () => {
  const { role, user } = useAuth();
  const facilityName = user?.facilityName;

  // Data Hooks
  const { data: facilityScores, isLoading: isLoadingScores, isError: isErrorScores } = useFacilityScores();
  const { data: heatmapData, isLoading: isLoadingHeatmap, isError: isErrorHeatmap } = useDataQualityHeatmap();
  const { data: trendData, isLoading: isLoadingTrend } = useCompletenessTrend();
  const { data: errorDistData, isLoading: isLoadingErrorDist } = useErrorDistribution();

  const getTitle = () => {
    if (role === "FacilityAdmin") return `${facilityName || 'Your Facility'} Data Quality Score`;
    return "Data Quality Center";
  };

  const getDescription = () => {
    if (role === "FacilityAdmin") return "Monitor your facility's compliance with the Minimum Dataset Standard.";
    return "Monitor and enforce minimum dataset compliance";
  };

  // Calculate overall metrics based on fetched data
  const overallCompleteness = facilityScores?.length 
    ? (facilityScores.reduce((sum, f) => sum + f.score, 0) / facilityScores.length).toFixed(1)
    : "N/A";

  // Mocking validation errors and MDS compliance based on the first score if FacilityAdmin
  const totalFacilities = facilityScores?.length || 0;
  const facilitiesMeetingMDS = facilityScores?.filter(f => f.score >= 80).length || 0;
  
  const validationErrors = role === "FacilityAdmin" ? "12" : "342"; // Still mocked until we integrate with audit logs for error counts
  const complianceRate = totalFacilities > 0 
    ? `${((facilitiesMeetingMDS / totalFacilities) * 100).toFixed(1)}% compliance rate`
    : "N/A";
    
  const facilitiesMeetingMDSLabel = role === "FacilityAdmin"
    ? (totalFacilities > 0 && facilitiesMeetingMDS > 0 ? "1/1" : "0/1")
    : `${facilitiesMeetingMDS}/${totalFacilities}`;


  const renderFacilityScores = () => {
    if (isLoadingScores) {
      return (
        <div className="space-y-4">
          {[...Array(role === 'FacilityAdmin' ? 1 : 3)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      );
    }
    
    if (isErrorScores || !facilityScores) {
        return (
            <Card className="p-8 border-destructive/20 bg-destructive/10 text-center">
                <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-3" />
                <p className="text-destructive">Error loading facility scores.</p>
            </Card>
        );
    }

    return (
      <div className="space-y-4">
        {facilityScores.map((facility, index) => (
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
    );
  };

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
          <p className="text-3xl font-bold text-foreground mb-4">{isLoadingScores ? <Loader2 className="w-6 h-6 animate-spin" /> : `${overallCompleteness}%`}</p>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${parseFloat(overallCompleteness as string) || 0}%` }} />
          </div>
        </Card>
        <Card className="p-6 border-border">
          <p className="text-sm text-muted-foreground mb-2">Validation Errors (24h)</p>
          <p className="text-3xl font-bold text-destructive mb-2">{validationErrors}</p>
          <p className="text-sm text-muted-foreground">-15% from yesterday</p>
        </Card>
        <Card className="p-6 border-border">
          <p className="text-sm text-muted-foreground mb-2">Facilities Meeting MDS</p>
          <p className="text-3xl font-bold text-success mb-2">{isLoadingScores ? <Loader2 className="w-6 h-6 animate-spin" /> : facilitiesMeetingMDSLabel}</p>
          <p className="text-sm text-muted-foreground">{complianceRate}</p>
        </Card>
      </div>

      {/* Heatmap is only relevant for MoH, so we hide it for Facility Admin */}
      {role === "MoH" && (
        <DataQualityHeatmap 
          data={heatmapData || []} 
          isLoading={isLoadingHeatmap} 
          isError={isErrorHeatmap} 
        />
      )}

      <Card className="p-6 border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          {role === "FacilityAdmin" ? "Your Facility Score" : "Facility Completeness Scores"}
        </h3>
        {renderFacilityScores()}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ErrorDistributionChart 
          data={errorDistData || []} 
          isLoading={isLoadingErrorDist} 
        /> 
        <CompletenessTrendChart 
          data={trendData || []} 
          isLoading={isLoadingTrend} 
        />
      </div>
    </div>
  );
};

export default DataQuality;