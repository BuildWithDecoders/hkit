import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Server, Database, Zap, Clock } from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect } from "react";

const latencyData = [
  { time: "00:00", api: 45, db: 12 },
  { time: "04:00", api: 52, db: 15 },
  { time: "08:00", api: 78, db: 23 },
  { time: "12:00", api: 92, db: 28 },
  { time: "16:00", api: 85, db: 25 },
  { time: "20:00", api: 68, db: 18 },
  { time: "23:59", api: 55, db: 14 },
];

const throughputData = [
  { time: "00:00", requests: 1250 },
  { time: "04:00", requests: 980 },
  { time: "08:00", requests: 2340 },
  { time: "12:00", requests: 2890 },
  { time: "16:00", requests: 2650 },
  { time: "20:00", requests: 1870 },
  { time: "23:59", requests: 1420 },
];

const SystemHealth = () => {
  useEffect(() => {
    document.title = "System Health & Observability | Hkit Portal";
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">System Health & Observability</h1>
        <p className="text-muted-foreground">Monitor infrastructure performance and reliability</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 border-border">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-8 h-8 text-success" />
            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
              Healthy
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-1">System Status</p>
          <p className="text-2xl font-bold text-foreground">99.9%</p>
          <p className="text-xs text-muted-foreground mt-1">Uptime (30d)</p>
        </Card>

        <Card className="p-6 border-border">
          <div className="flex items-center justify-between mb-2">
            <Server className="w-8 h-8 text-primary" />
            <span className="text-sm text-muted-foreground">avg</span>
          </div>
          <p className="text-sm text-muted-foreground mb-1">API Latency</p>
          <p className="text-2xl font-bold text-foreground">78ms</p>
          <p className="text-xs text-success mt-1">-12ms from baseline</p>
        </Card>

        <Card className="p-6 border-border">
          <div className="flex items-center justify-between mb-2">
            <Database className="w-8 h-8 text-info" />
            <span className="text-sm text-muted-foreground">p95</span>
          </div>
          <p className="text-sm text-muted-foreground mb-1">DB Query Time</p>
          <p className="text-2xl font-bold text-foreground">24ms</p>
          <p className="text-xs text-success mt-1">Optimal</p>
        </Card>

        <Card className="p-6 border-border">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-8 h-8 text-warning" />
            <span className="text-sm text-muted-foreground">req/min</span>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Throughput</p>
          <p className="text-2xl font-bold text-foreground">2,890</p>
          <p className="text-xs text-muted-foreground mt-1">Peak: 3,200</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Response Time (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={latencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
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
                dataKey="api"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                name="API (ms)"
              />
              <Line
                type="monotone"
                dataKey="db"
                stroke="hsl(var(--info))"
                strokeWidth={2}
                name="Database (ms)"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Request Throughput (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={throughputData}>
              <defs>
                <linearGradient id="throughputGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="requests"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#throughputGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Server className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">API Gateway</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                Healthy
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Instances</span>
              <span className="text-foreground font-medium">4 active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">CPU Usage</span>
              <span className="text-foreground font-medium">42%</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
              <Database className="w-5 h-5 text-info" />
            </div>
            <h3 className="font-semibold text-foreground">FHIR Database</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                Healthy
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Connections</span>
              <span className="text-foreground font-medium">145/500</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Storage</span>
              <span className="text-foreground font-medium">2.3 TB</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <h3 className="font-semibold text-foreground">Message Queue</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                Healthy
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Queue Depth</span>
              <span className="text-foreground font-medium">234 msgs</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Processing</span>
              <span className="text-foreground font-medium">89 msg/s</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SystemHealth;