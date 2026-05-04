"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AddHabitDialog } from "@/components/AddHabitDialog";
import { EditHabitDialog } from "@/components/EditHabitDialog";
import { EmptyState } from "@/components/EmptyState";
import { StreakBadge } from "@/components/StreakBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Habit } from "@/components/HabitCard";

function HabitRowWithStreak({
  habit,
  onEdit,
  index,
}: {
  habit: Habit;
  onEdit: () => void;
  index: number;
}) {
  const streak = useQuery(api.habitLogs.getStreakForHabit, {
    habitId: habit._id,
  });

  return (
    <div
      className="group flex items-center gap-4 px-4 py-3.5 rounded-lg bg-card border border-border hover:border-border/80 transition-all duration-200"
      style={{ animation: "fade-up 0.3s ease both", animationDelay: `${index * 45}ms` }}
    >
      <span className="text-xl shrink-0">{habit.emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate text-foreground">{habit.name}</p>
        {habit.description && (
          <p className="text-xs text-muted-foreground truncate mt-0.5 leading-relaxed">
            {habit.description}
          </p>
        )}
        {(streak ?? 0) > 0 && (
          <div className="mt-0.5">
            <StreakBadge streak={streak ?? 0} />
          </div>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "shrink-0 h-7 w-7 text-muted-foreground/40 hover:text-muted-foreground",
          "opacity-0 group-hover:opacity-100 transition-all duration-200"
        )}
        onClick={onEdit}
        aria-label={`Edit ${habit.name}`}
      >
        <Pencil className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

export default function HabitsPage() {
  const habits = useQuery(api.habits.list);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const loading = habits === undefined;

  return (
    <div className="max-w-lg mx-auto px-4 pt-8 space-y-7 [animation:fade-up_0.3s_ease_both]">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div className="space-y-0.5">
          <p className="font-display italic text-xs tracking-[0.2em] uppercase text-muted-foreground">
            All habits
          </p>
          <h1 className="text-[2rem] font-bold leading-none tracking-tight">
            My Habits
          </h1>
        </div>
        <AddHabitDialog />
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-2.5">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[58px] rounded-lg" />
          ))}
        </div>
      ) : habits.length === 0 ? (
        <EmptyState
          title="Nothing here yet"
          description="Create a habit and start showing up every day."
          action={
            <AddHabitDialog
              trigger={
                <Button size="sm" className="mt-1 font-semibold tracking-wide">
                  Create a habit
                </Button>
              }
            />
          }
        />
      ) : (
        <div className="space-y-2">
          {habits.map((habit, i) => (
            <HabitRowWithStreak
              key={habit._id}
              habit={habit}
              onEdit={() => setEditingHabit(habit)}
              index={i}
            />
          ))}
        </div>
      )}

      <EditHabitDialog
        habit={editingHabit}
        open={editingHabit !== null}
        onOpenChange={(open) => !open && setEditingHabit(null)}
      />
    </div>
  );
}
