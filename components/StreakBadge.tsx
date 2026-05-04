import { Badge } from "@/components/ui/badge";

interface StreakBadgeProps {
  streak: number;
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  if (streak === 0) return null;

  return (
    <Badge variant="secondary" className="text-xs font-semibold tabular-nums">
      🔥 {streak}
    </Badge>
  );
}
