"use client";

import { cn } from "@/lib/utils";
import { StreakBadge } from "@/components/StreakBadge";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import type { Id } from "@/convex/_generated/dataModel";

export interface Habit {
  _id: Id<"habits">;
  _creationTime: number;
  name: string;
  emoji: string;
  description?: string;
  createdAt: number;
  isArchived: boolean;
}

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  streak: number;
  onToggle: () => void;
  onEdit: () => void;
}

export function HabitCard({
  habit,
  isCompleted,
  streak,
  onToggle,
  onEdit,
}: HabitCardProps) {
  return (
    <div
      className={cn(
        "group relative flex items-center gap-4 px-4 py-3.5 rounded-lg cursor-pointer select-none",
        "border transition-all duration-200",
        "active:scale-[0.985]",
        isCompleted
          ? "bg-card border-l-2 border-l-primary border-t-border/50 border-r-border/50 border-b-border/50"
          : "bg-card border-border hover:border-border/80 hover:bg-card/80"
      )}
      onClick={onToggle}
      role="button"
      aria-pressed={isCompleted}
    >
      {/* Ink-stamp completion circle */}
      {/* key change forces remount → triggers stamp animation on check */}
      <div
        key={isCompleted ? "done" : "pending"}
        className={cn(
          "shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center",
          "transition-colors duration-300",
          isCompleted
            ? "bg-primary border-primary [animation:stamp-in_0.38s_cubic-bezier(0.34,1.56,0.64,1)_both]"
            : "border-muted-foreground/35 bg-transparent"
        )}
        style={{ willChange: "transform" }}
      >
        {isCompleted && (
          <svg
            className="h-3.5 w-3.5 text-primary-foreground"
            viewBox="0 0 14 14"
            fill="none"
          >
            <path
              d="M2.5 7L5.5 10L11.5 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {/* Emoji */}
      <span
        className={cn(
          "text-xl shrink-0 transition-all duration-300",
          isCompleted && "grayscale-[30%]"
        )}
      >
        {habit.emoji}
      </span>

      {/* Name + streak */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "font-medium text-sm leading-snug truncate transition-all duration-300",
            isCompleted
              ? "text-muted-foreground line-through decoration-primary/60 decoration-1"
              : "text-foreground"
          )}
        >
          {habit.name}
        </p>
        {streak > 0 && (
          <div className="mt-0.5 [animation:fade-up_0.25s_ease_both]">
            <StreakBadge streak={streak} />
          </div>
        )}
      </div>

      {/* Edit — stops card toggle */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "shrink-0 h-7 w-7 transition-all duration-200",
          "text-muted-foreground/40 hover:text-muted-foreground",
          "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
        )}
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        aria-label={`Edit ${habit.name}`}
      >
        <Pencil className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
