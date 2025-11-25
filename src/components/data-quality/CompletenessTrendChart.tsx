import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CompletenessTrend } from "@/api/hkit";
import { Loader2 } from "lucide-react";

interface CompletenessTrendChartProps {
    data: CompletenessTrend[];
    isLoading: boolean;
}

export function CompletenessTrendChart({ data, isLoading }: CompletenessTrendChartProps) {
  if (isLoading) {
    return (
      <Card className="p-6 border-border">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-lg font-semibold text-foreground">
            Overall Completeness Trend (7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 h-[300px] flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-6 border-border">
      <CardHeader className="p-0 mb-4">
        <CardTitle className="text-lg font-semibold text-foreground">
          Overall Completeness Trend (7 Days)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              domain={[80, 100]} 
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              formatter={(value: number) => [`${value.toFixed(1)}%`, 'Score']}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 8 }}
              name="Completeness Score"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}