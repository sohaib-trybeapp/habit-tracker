"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AddHabitDialog } from "@/components/AddHabitDialog";
import { EditHabitDialog } from "@/components/EditHabitDialog";
import { EmptyState } from "@/components/EmptyState";
import { StreakBadge } from "@/components/StreakBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight } from "lucide-react";
import type { Habit } from "@/components/HabitCard";

function HabitRow({
  habit,
  onEdit,
  isLast,
}: {
  habit: Habit;
  onEdit: () => void;
  isLast: boolean;
}) {
  const streak = useQuery(api.habitLogs.getStreakForHabit, {
    habitId: habit._id,
  });

  return (
    <div className="relative">
      <button
        className="flex items-center gap-3 w-full px-4 py-3 text-left active:opacity-60 transition-opacity duration-75"
        onClick={onEdit}
      >
        <span className="text-xl shrink-0">{habit.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="text-[17px] leading-snug truncate text-foreground">
            {habit.name}
          </p>
          {habit.description && (
            <p
              className="text-[13px] truncate mt-0.5 leading-snug"
              style={{ color: "var(--ios-tertiary-label)" }}
            >
              {habit.description}
            </p>
          )}
          {(streak ?? 0) > 0 && <StreakBadge streak={streak ?? 0} />}
        </div>
        <ChevronRight
          className="h-4 w-4 shrink-0 stroke-[1.5]"
          style={{ color: "var(--ios-tertiary-label)" }}
        />
      </button>
      {!isLast && (
        <div
          className="absolute bottom-0 right-0 h-px"
          style={{ left: "52px", background: "var(--ios-separator)" }}
        />
      )}
    </div>
  );
}

function HabitsPageInner() {
  const searchParams = useSearchParams();
  const habits = useQuery(api.habits.list);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get("new") === "true") {
      const timer = setTimeout(() => setAddOpen(true), 350);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const loading = habits === undefined;

  return (
    <div
      className="max-w-lg mx-auto pt-10 pb-4"
      style={{ animation: "ios-slide-in 0.28s cubic-bezier(0.25, 0.46, 0.45, 0.94) both" }}
    >

      {/* iOS large title header */}
      <div className="flex items-end justify-between px-4 mb-6">
        <h1 className="text-[34px] font-bold leading-none tracking-tight">
          My Habits
        </h1>
        <AddHabitDialog open={addOpen} onOpenChange={setAddOpen} />
      </div>

      {/* List */}
      {loading ? (
        <div className="mx-4 rounded-[10px] overflow-hidden bg-card">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[52px] rounded-none" />
          ))}
        </div>
      ) : habits.length === 0 ? (
        <EmptyState
          title="No habits yet"
          description="Create a habit and start showing up every day."
          action={
            <AddHabitDialog
              trigger={
                <Button size="sm" className="mt-1">
                  Create a habit
                </Button>
              }
            />
          }
        />
      ) : (
        <div
          className="mx-4 rounded-[10px] overflow-hidden"
          style={{ background: "var(--card)" }}
        >
          {habits.map((habit, i) => (
            <HabitRow
              key={habit._id}
              habit={habit}
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

export default function HabitsPage() {
  return (
    <Suspense>
      <HabitsPageInner />
    </Suspense>
  );
}
