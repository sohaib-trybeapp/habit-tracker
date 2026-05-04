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

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Today</h1>
          <p className="text-sm text-muted-foreground">
            {formatDisplayDate(new Date())}
          </p>
        </div>
        <AddHabitDialog />
      </div>

      {/* Progress bar */}
      {!loading && totalCount > 0 && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              {doneCount} / {totalCount} completed
            </span>
            <span>{Math.round((doneCount / totalCount) * 100)}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${(doneCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Habit list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[72px] rounded-xl" />
          ))}
        </div>
      ) : habits.length === 0 ? (
        <EmptyState
          title="No habits yet"
          description="Add your first habit to start building your streak."
          action={
            <AddHabitDialog
              trigger={
                <Button size="lg" className="mt-2">
                  Add your first habit
                </Button>
              }
            />
          }
        />
      ) : (
        <div className="space-y-3">
          {habits.map((habit) => (
            <HabitCardWithStreak
              key={habit._id}
              habit={habit}
              isCompleted={completedIds.has(habit._id)}
              date={today}
              onEdit={() => setEditingHabit(habit)}
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
