interface StreakBadgeProps {
  streak: number;
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  if (streak === 0) return null;

  return (
    <span
      className="inline-flex items-center gap-0.5 text-xs font-semibold tabular-nums"
      style={{ color: "oklch(0.75 0.13 78)" }}
    >
      <span className="text-[10px]">🔥</span>
      <span>{streak}</span>
    </span>
  );
}
