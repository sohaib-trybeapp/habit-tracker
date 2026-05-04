"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getTodayString, formatDisplayDate } from "@/lib/dates";
import { HabitCard, type Habit } from "@/components/HabitCard";
import { AddHabitDialog } from "@/components/AddHabitDialog";
import { EditHabitDialog } from "@/components/EditHabitDialog";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function HabitCardWithStreak({
  habit,
  isCompleted,
  date,
  onEdit,
}: {
  habit: Habit;
  isCompleted: boolean;
  date: string;
  onEdit: () => void;
}) {
  const streak = useQuery(api.habitLogs.getStreakForHabit, {
    habitId: habit._id,
  });
  const toggleToday = useMutation(api.habitLogs.toggleToday);

  return (
    <HabitCard
      habit={habit}
      isCompleted={isCompleted}
      streak={streak ?? 0}
      onToggle={() => toggleToday({ habitId: habit._id, date })}
      onEdit={onEdit}
    />
  );
}

export default function TodayPage() {
  const today = getTodayString();
  const habits = useQuery(api.habits.list);
  const completions = useQuery(api.habitLogs.getCompletionsForDate, {
    date: today,
  });

  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const loading = habits === undefined || completions === undefined;
  const completedIds = new Set(completions?.map((c) => c.habitId) ?? []);
  const doneCount = habits?.filter((h) => completedIds.has(h._id)).length ?? 0;
  const totalCount = habits?.length ?? 0;
  const pct = totalCount > 0 ? (doneCount / totalCount) * 100 : 0;
  const allDone = totalCount > 0 && doneCount === totalCount;

  return (
    <div className="max-w-lg mx-auto px-4 pt-8 space-y-7 [animation:fade-up_0.3s_ease_both]">

      {/* Journal-style header */}
      <div className="flex items-end justify-between">
        <div className="space-y-0.5">
          <p className="font-display italic text-xs tracking-[0.2em] uppercase text-muted-foreground">
            {formatDisplayDate(new Date())}
          </p>
          <h1 className="text-[2rem] font-bold leading-none tracking-tight">
            {allDone && totalCount > 0 ? "Done ✦" : "Today"}
          </h1>
        </div>
        <AddHabitDialog />
      </div>

      {/* Amber progress bar */}
      {!loading && totalCount > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium tracking-wide">
              {doneCount} of {totalCount}
            </span>
            <span
              className="text-xs font-bold tabular-nums transition-all duration-500"
              style={{ color: pct > 0 ? "oklch(0.75 0.13 78)" : undefined }}
            >
              {Math.round(pct)}%
            </span>
          </div>
          <div className="h-1 rounded-full bg-muted/60 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${pct}%`,
                background:
                  "linear-gradient(90deg, oklch(0.70 0.12 75), oklch(0.82 0.14 82))",
                boxShadow: pct > 0 ? "0 0 10px 1px oklch(0.75 0.13 78 / 0.45)" : "none",
              }}
            />
          </div>
        </div>
      )}

      {/* Habit list */}
      {loading ? (
        <div className="space-y-2.5">
          {[1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              className="h-[58px] rounded-lg"
              style={{ animationDelay: `${i * 60}ms` }}
            />
          ))}
        </div>
      ) : habits.length === 0 ? (
        <EmptyState
          title="Nothing here yet"
          description="Add your first habit and start building a streak."
          action={
            <AddHabitDialog
              trigger={
                <Button
                  size="sm"
                  className="mt-1 font-semibold tracking-wide"
                >
                  Add a habit
                </Button>
              }
            />
          }
        />
      ) : (
        <div className="space-y-2">
          {habits.map((habit, i) => (
            <div
              key={habit._id}
              style={{ animation: `fade-up 0.3s ease both`, animationDelay: `${i * 45}ms` }}
            >
              <HabitCardWithStreak
                habit={habit}
                isCompleted={completedIds.has(habit._id)}
                date={today}
                onEdit={() => setEditingHabit(habit)}
              />
            </div>
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
