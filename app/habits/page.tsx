"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AddHabitDialog } from "@/components/AddHabitDialog";
import { EditHabitDialog } from "@/components/EditHabitDialog";
import { EmptyState } from "@/components/EmptyState";
import { StreakBadge } from "@/components/StreakBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Pencil, Plus } from "lucide-react";
import type { Habit } from "@/components/HabitCard";

function HabitRowWithStreak({
  habit,
  onEdit,
}: {
  habit: Habit;
  onEdit: () => void;
}) {
  const streak = useQuery(api.habitLogs.getStreakForHabit, {
    habitId: habit._id,
  });

  return (
    <Card className="flex items-center gap-4 p-4">
      <span className="text-2xl shrink-0">{habit.emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{habit.name}</p>
        {habit.description && (
          <p className="text-sm text-muted-foreground truncate">
            {habit.description}
          </p>
        )}
        {(streak ?? 0) > 0 && (
          <div className="mt-1">
            <StreakBadge streak={streak ?? 0} />
          </div>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 h-8 w-8 text-muted-foreground"
        onClick={onEdit}
        aria-label={`Edit ${habit.name}`}
      >
        <Pencil className="h-4 w-4" />
      </Button>
    </Card>
  );
}

export default function HabitsPage() {
  const habits = useQuery(api.habits.list);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const loading = habits === undefined;

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Habits</h1>
        <AddHabitDialog />
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[72px] rounded-xl" />
          ))}
        </div>
      ) : habits.length === 0 ? (
        <EmptyState
          title="No habits yet"
          description="Create your first habit and start building momentum."
          action={
            <AddHabitDialog
              trigger={
                <Button size="lg" className="mt-2 gap-2">
                  <Plus className="h-4 w-4" />
                  Create your first habit
                </Button>
              }
            />
          }
        />
      ) : (
        <div className="space-y-3">
          {habits.map((habit) => (
            <HabitRowWithStreak
              key={habit._id}
              habit={habit}
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
