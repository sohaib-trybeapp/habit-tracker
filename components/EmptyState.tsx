interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-16 px-6 text-center [animation:fade-up_0.4s_ease_both]">
      <div
        className="text-4xl opacity-40"
        style={{ filter: "grayscale(0.3)" }}
      >
        🌱
      </div>
      <div className="space-y-2">
        <h3 className="font-display italic text-xl font-normal text-foreground/80">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground max-w-[260px] leading-relaxed">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}
