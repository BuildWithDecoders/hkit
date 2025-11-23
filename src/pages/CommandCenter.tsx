import { MetricCard } from "@/components/dashboard/MetricCard";
import { Card } from "@/components/ui/card";
import { Building2, Activity, CheckCircle2, AlertCircle, TrendingUp } from "lucide-react";
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
  BarChart,
  Bar,
} from "recharts";

const eventData = [
  { time: "00:00", events: 245 },
  { time: "04:00", events: 189 },
  { time: "08:00", events: 467 },
  { time: "12:00", events: 523 },
  { time: "16:00", events: 489 },
  { time: "20:00", events: 356 },
  { time: "23:59", events: 298 },
];

const facilityData = [
  { name: "Ilorin", facilities: 45, active: 42 },
  { name: "Offa", facilities: 28, active: 26 },
  { name: "Jebba", facilities: 18, active: 17 },
  { name: "Lafiagi", facilities: 15, active: 14 },
  { name: "Patigi", facilities: 12, active: 11 },
];

const errorLogs = [
  { id: 1, facility: "General Hospital Ilorin", error: "FHIR validation failed: Missing patient identifier", time: "2 min ago", severity: "high" },
  { id: 2, facility: "Baptist Medical Centre", error: "Authentication token expired", time: "5 min ago", severity: "medium" },
  { id: 3, facility: "Sobi Specialist Hospital", error: "HL7 transformation timeout", time: "8 min ago", severity: "high" },
  { id: 4, facility: "Private Clinic Offa", error: "Rate limit exceeded", time: "12 min ago", severity: "low" },
];

const CommandCenter = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">State HIE Command Center</h1>
        <p className="text-muted-foreground">Real-time overview of health information exchange across Kwara State</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Connected Facilities"
          value="118"
          change="+3 this week"
          changeType="positive"
          icon={Building2}
        />
        <MetricCard
          title="FHIR Events/Min"
          value="523"
          change="+12% from avg"
          changeType="positive"
          icon={Activity}
        />
        <MetricCard
          title="API Success Rate"
          value="99.2%"
          change="Operational"
          changeType="positive"
          icon={CheckCircle2}
        />
        <MetricCard
          title="Active Integrations"
          value="110"
          change="93.2% uptime"
          changeType="positive"
          icon={TrendingUp}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">FHIR Event Stream (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={eventData}>
              <defs>
                <linearGradient id="eventGradient" x1="0" y1="0" x2="0" y2="1">
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
                dataKey="events"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#eventGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Facilities by LGA</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={facilityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="facilities" fill="hsl(var(--muted))" radius={[8, 8, 0, 0]} />
              <Bar dataKey="active" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6 border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Live Error Feed</h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">Live</span>
          </div>
        </div>
        <div className="space-y-3">
          {errorLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-start justify-between p-4 rounded-lg bg-secondary border border-border hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start gap-3 flex-1">
                <AlertCircle
                  className={`w-5 h-5 mt-0.5 ${
                    log.severity === "high"
                      ? "text-destructive"
                      : log.severity === "medium"
                      ? "text-warning"
                      : "text-muted-foreground"
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{log.facility}</p>
                  <p className="text-sm text-muted-foreground mt-1">{log.error}</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{log.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default CommandCenter;
