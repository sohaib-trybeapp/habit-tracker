interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 px-6 text-center">
      <div className="text-5xl" style={{ opacity: 0.25 }}>
        🌱
      </div>
      <div className="space-y-1.5">
        <h3 className="text-[17px] font-semibold text-foreground">{title}</h3>
        <p
          className="text-[15px] leading-snug max-w-[260px]"
          style={{ color: "var(--ios-tertiary-label)" }}
        >
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}
