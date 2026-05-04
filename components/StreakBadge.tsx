interface StreakBadgeProps {
  streak: number;
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  if (streak === 0) return null;

  return (
    <span
      className="inline-flex items-center gap-[3px] text-[12px] font-medium tabular-nums leading-none"
      style={{ color: "var(--ios-tertiary-label)" }}
    >
      🔥 <span>{streak} day streak</span>
    </span>
  );
}
