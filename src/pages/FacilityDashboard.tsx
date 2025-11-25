import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { CheckCircle2, AlertCircle, Database, Activity, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const activityData = [
  { hour: "08:00", submissions: 120 },
  { hour: "10:00", submissions: 155 },
  { hour: "12:00", submissions: 180 },
  { hour: "14:00", submissions: 140 },
  { hour: "16:00", submissions: 165 },
  { hour: "18:00", submissions: 130 },
];

const FacilityDashboard = () => {
  const { user } = useAuth();
  const facilityName = user?.facilityName || "Your Facility";

  useEffect(() => {
    document.title = `${facilityName} Dashboard | Hkit Portal`;
  }, [facilityName]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">{facilityName} Dashboard</h1>
        <p className="text-muted-foreground">Overview of data quality and integration health for your facility.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Data Quality Score"
          value="92%"
          change="Target: 90%"
          changeType="positive"
          icon={Database}
        />
        <MetricCard
          title="API Success Rate (24h)"
          value="99.8%"
          change="Operational"
          changeType="positive"
          icon={CheckCircle2}
        />
        <MetricCard
          title="Failed Submissions (24h)"
          value="4"
          change="Last failure: 1h ago"
          changeType="negative"
          icon={AlertCircle}
        />
        <MetricCard
          title="FHIR Events Sent"
          value="2,145"
          change="+5% from yesterday"
          changeType="positive"
          icon={Activity}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 border-border lg:col-span-2">
          <h3 className="text-lg font-semibold text-foreground mb-4">FHIR Submission Activity (Today)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="submissions"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Submissions"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Data Quality Trends</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-success/10 border border-success/20">
              <p className="text-sm font-medium text-foreground mb-1">Completeness</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-success">95%</span>
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
            </div>
            <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
              <p className="text-sm font-medium text-foreground mb-1">Timeliness</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-warning">88%</span>
                <TrendingUp className="w-6 h-6 text-warning" />
              </div>
            </div>
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-sm font-medium text-foreground mb-1">Validation Rate</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary">99%</span>
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FacilityDashboard;