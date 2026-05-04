"use client";

import { cn } from "@/lib/utils";
import { StreakBadge } from "@/components/StreakBadge";
import { ChevronRight } from "lucide-react";
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
    <div className="relative flex items-center min-h-[52px]">
      {/* Tap area for toggling — left + center */}
      <button
        className="flex items-center gap-3 flex-1 min-w-0 pl-4 py-3 text-left active:opacity-60 transition-opacity duration-75"
        onClick={onToggle}
        aria-pressed={isCompleted}
      >
        {/* iOS-style completion circle */}
        {/* key flip forces remount → CSS animation fires on check */}
        <div
          key={isCompleted ? "on" : "off"}
          className="shrink-0 h-[26px] w-[26px] rounded-full flex items-center justify-center transition-colors"
          style={{
            background: isCompleted ? "var(--ios-green)" : "transparent",
            border: isCompleted ? "none" : "2px solid var(--ios-tertiary-label)",
            animation: isCompleted
              ? "ios-check-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both"
              : "none",
          }}
        >
          {isCompleted && (
            <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" fill="none">
              <path
                d="M2.5 7.5l3 3 6-6"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>

        {/* Emoji */}
        <span className="text-xl shrink-0">{habit.emoji}</span>

        {/* Name + streak */}
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "text-[17px] leading-snug truncate transition-colors duration-200",
              isCompleted ? "text-muted-foreground line-through decoration-1" : "text-foreground"
            )}
          >
            {habit.name}
          </p>
          {streak > 0 && (
            <StreakBadge streak={streak} />
          )}
        </div>
      </button>

      {/* Edit chevron — right side */}
      <div className="flex items-center">
        <button
          className="flex items-center pr-3 pl-2 py-3 text-muted-foreground/40 active:opacity-60 transition-opacity duration-75"
          onClick={onEdit}
          aria-label={`Edit ${habit.name}`}
        >
          <ChevronRight className="h-4 w-4 stroke-[1.5]" />
        </button>
      </div>
    </div>
  );
}
