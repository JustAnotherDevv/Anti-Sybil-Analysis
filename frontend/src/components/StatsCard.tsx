import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  loading?: boolean;
}

export function StatsCard({
  title,
  value,
  description,
  loading = false,
}: StatsCardProps) {
  if (loading) {
    return (
      <Card className="transform transition-all hover:scale-105">
        <CardContent className="p-6">
          <Skeleton className="h-4 w-[100px] mb-2" />
          <Skeleton className="h-8 w-[120px] mb-2" />
          {description && <Skeleton className="h-4 w-[150px]" />}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="transform transition-all hover:scale-105">
      <CardContent className="p-6">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
