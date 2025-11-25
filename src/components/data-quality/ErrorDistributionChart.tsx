import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { ErrorDistribution } from "@/api/hkit";
import { Loader2 } from "lucide-react";

interface ErrorDistributionChartProps {
    data: ErrorDistribution[];
    isLoading: boolean;
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export function ErrorDistributionChart({ data, isLoading }: ErrorDistributionChartProps) {
  if (isLoading) {
    return (
      <Card className="p-6 border-border">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-lg font-semibold text-foreground">
            Validation Error Distribution (24h)
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
          Validation Error Distribution (24h)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              labelLine={false}
              label={renderCustomizedLabel}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string, props) => [value.toLocaleString(), props.payload.name]}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend 
                layout="vertical" 
                verticalAlign="middle" 
                align="right" 
                wrapperStyle={{ paddingLeft: '20px' }}
                iconType="circle"
                formatter={(value, entry) => <span className="text-sm text-muted-foreground">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}