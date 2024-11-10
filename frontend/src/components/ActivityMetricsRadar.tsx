import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ActivityMetricsProps {
  activityScore: ActivityScore;
}

export function ActivityMetricsRadar({ activityScore }: ActivityMetricsProps) {
  const metricsData = [
    {
      metric: "Transaction Score",
      value: activityScore.transaction_score,
      fullMark: 100,
    },
    {
      metric: "Volume Score",
      value: activityScore.volume_score,
      fullMark: 100,
    },
    {
      metric: "Frequency Score",
      value: activityScore.frequency_score,
      fullMark: 100,
    },
    {
      metric: "Age Score",
      value: activityScore.age_score,
      fullMark: 100,
    },
    {
      metric: "Human Probability",
      value: activityScore.human_probability,
      fullMark: 100,
    },
    {
      metric: "Network Diversity",
      value: Math.min(
        100,
        (activityScore.unique_interactions_count / 10) * 100
      ),
      fullMark: 100,
    },
  ];

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "HIGH":
        return "#ef4444";
      case "MEDIUM":
        return "#f59e0b";
      case "LOW":
        return "#22c55e";
      default:
        return "#64748b";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Metrics Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={metricsData}>
              <PolarGrid />
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fill: "currentColor", fontSize: 12 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fill: "currentColor", fontSize: 12 }}
              />
              <Radar
                name="Activity Score"
                dataKey="value"
                stroke={getRiskColor(activityScore.risk_level)}
                fill={getRiskColor(activityScore.risk_level)}
                fillOpacity={0.3}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border rounded-lg shadow-lg p-2">
                        <p className="font-medium">
                          {payload[0].payload.metric}
                        </p>
                        <p className="text-sm">
                          Score: {payload[0].value.toFixed(1)}%
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
