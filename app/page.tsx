"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getTodayString, formatDisplayDate } from "@/lib/dates";
import { HabitCard, type Habit } from "@/components/HabitCard";
import { EditHabitDialog } from "@/components/EditHabitDialog";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function HabitCardWithStreak({
  habit,
  isCompleted,
  date,
  onEdit,
  isLast,
}: {
  habit: Habit;
  isCompleted: boolean;
  date: string;
  onEdit: () => void;
  isLast: boolean;
}) {
  const streak = useQuery(api.habitLogs.getStreakForHabit, {
    habitId: habit._id,
  });
  const toggleToday = useMutation(api.habitLogs.toggleToday);

  return (
    <div className="relative">
      <HabitCard
        habit={habit}
        isCompleted={isCompleted}
        streak={streak ?? 0}
        onToggle={() => toggleToday({ habitId: habit._id, date })}
        onEdit={onEdit}
      />
      {!isLast && (
        <div
          className="absolute bottom-0 right-0 h-px"
          style={{
            left: "64px",
            background: "var(--ios-separator)",
          }}
        />
      )}
    </div>
  );
}

export default function TodayPage() {
  const today = getTodayString();
  const habits = useQuery(api.habits.list);
  const completions = useQuery(api.habitLogs.getCompletionsForDate, {
    date: today,
  });

  const router = useRouter();
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const loading = habits === undefined || completions === undefined;
  const completedIds = new Set(completions?.map((c) => c.habitId) ?? []);
  const doneCount = habits?.filter((h) => completedIds.has(h._id)).length ?? 0;
  const totalCount = habits?.length ?? 0;
  const pct = totalCount > 0 ? (doneCount / totalCount) * 100 : 0;
  const allDone = totalCount > 0 && doneCount === totalCount;

  return (
    <div className="max-w-lg mx-auto pt-10 pb-4">

      {/* iOS large title header */}
      <div className="px-4 mb-2">
        <p
          className="text-[13px] font-medium uppercase tracking-[0.06em] mb-0.5"
          style={{ color: "var(--ios-tertiary-label)" }}
        >
          {formatDisplayDate(new Date())}
        </p>
        <h1 className="text-[34px] font-bold leading-none tracking-tight">
          {allDone && totalCount > 0 ? "All Done" : "Today"}
        </h1>
      </div>

      {/* Progress row */}
      {!loading && totalCount > 0 && (
        <div className="px-4 mb-6 mt-3">
          <div className="flex items-center justify-between mb-1.5">
            <span
              className="text-[13px] font-medium"
              style={{ color: "var(--ios-tertiary-label)" }}
            >
              {doneCount} of {totalCount} completed
            </span>
            <span
              className="text-[13px] font-semibold tabular-nums transition-all duration-500"
              style={{ color: pct > 0 ? "var(--primary)" : "var(--ios-tertiary-label)" }}
            >
              {Math.round(pct)}%
            </span>
          </div>
          <div
            className="h-[4px] rounded-full overflow-hidden"
            style={{ background: "var(--ios-separator)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${pct}%`,
                background: "var(--primary)",
              }}
            />
          </div>
        </div>
      )}

      {/* Habit list */}
      {loading ? (
        <div className="px-4 space-y-0 rounded-[10px] overflow-hidden bg-card">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[52px] rounded-none" />
          ))}
        </div>
      ) : habits.length === 0 ? (
        <EmptyState
          title="No habits yet"
          description="Add your first habit and start building a streak."
          action={
            <Button size="sm" className="mt-1" onClick={() => router.push("/habits?new=true")}>
              Create habit
            </Button>
          }
        />
      ) : (
        <div
          className="mx-4 rounded-[10px] overflow-hidden"
          style={{ background: "var(--card)" }}
        >
          {habits.map((habit, i) => (
            <HabitCardWithStreak
              key={habit._id}
              habit={habit}
              isCompleted={completedIds.has(habit._id)}
              date={today}
              onEdit={() => setEditingHabit(habit)}
              isLast={i === habits.length - 1}
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
