import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Code2, Key, Network, Activity, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Button } from "@/components/ui/button";

const apiUsageData = [
  { resource: "Patient", calls: 1200 },
  { resource: "Encounter", calls: 850 },
  { resource: "Observation", calls: 2100 },
  { resource: "Condition", calls: 450 },
];

const DeveloperDashboard = () => {
  const { user } = useAuth();
  const userName = user?.name || "Developer";

  useEffect(() => {
    document.title = `${userName}'s Developer Dashboard | Hkit Portal`;
  }, [userName]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">{userName}'s Developer Dashboard</h1>
        <p className="text-muted-foreground">Monitor API usage, key status, and integration health.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total API Calls (24h)"
          value="4,600"
          change="+15% from yesterday"
          changeType="positive"
          icon={Activity}
        />
        <MetricCard
          title="Active API Keys"
          value="2"
          change="Production & Sandbox"
          changeType="neutral"
          icon={Key}
        />
        <MetricCard
          title="Webhook Deliveries"
          value="99.9%"
          change="Operational"
          changeType="positive"
          icon={Network}
        />
        <MetricCard
          title="Average Latency"
          value="85ms"
          change="Stable"
          changeType="neutral"
          icon={TrendingUp}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 border-border lg:col-span-2">
          <h3 className="text-lg font-semibold text-foreground mb-4">API Usage by FHIR Resource (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={apiUsageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="resource" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="calls" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 border-border flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Key className="w-4 h-4 mr-2" />
                Generate New API Key
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Code2 className="w-4 h-4 mr-2" />
                Go to Sandbox Console
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Network className="w-4 h-4 mr-2" />
                View Webhook Logs
              </Button>
            </div>
          </div>
          <Button className="w-full mt-6 bg-primary hover:bg-primary/90">
            View Full Developer Portal
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default DeveloperDashboard;