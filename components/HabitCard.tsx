"use client";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
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
    <Card
      className={cn(
        "flex items-center gap-4 p-4 cursor-pointer select-none transition-all active:scale-[0.98]",
        isCompleted && "opacity-60"
      )}
      onClick={onToggle}
      role="button"
      aria-pressed={isCompleted}
    >
      {/* Completion indicator */}
      <div
        className={cn(
          "shrink-0 h-7 w-7 rounded-full border-2 flex items-center justify-center transition-colors",
          isCompleted
            ? "bg-primary border-primary text-primary-foreground"
            : "border-muted-foreground/40"
        )}
      >
        {isCompleted && (
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 8l3.5 3.5L13 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {/* Emoji */}
      <span className="text-2xl shrink-0">{habit.emoji}</span>

      {/* Name + streak */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "font-medium truncate",
            isCompleted && "line-through text-muted-foreground"
          )}
        >
          {habit.name}
        </p>
        {streak > 0 && (
          <div className="mt-0.5">
            <StreakBadge streak={streak} />
          </div>
        )}
      </div>

      {/* Edit button — stop propagation so card toggle doesn't fire */}
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 h-8 w-8 text-muted-foreground"
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        aria-label={`Edit ${habit.name}`}
      >
        <Pencil className="h-4 w-4" />
      </Button>
    </Card>
  );
}
