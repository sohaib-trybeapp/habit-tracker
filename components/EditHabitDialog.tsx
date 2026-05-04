"use client";

import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmojiPickerInput } from "@/components/EmojiPickerInput";
import { Trash2 } from "lucide-react";
import type { Habit } from "@/components/HabitCard";

interface EditHabitDialogProps {
  habit: Habit | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditHabitDialog({
  habit,
  open,
  onOpenChange,
}: EditHabitDialogProps) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("✨");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [archiving, setArchiving] = useState(false);

  const updateHabit = useMutation(api.habits.update);
  const archiveHabit = useMutation(api.habits.archive);

  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setEmoji(habit.emoji);
      setDescription(habit.description ?? "");
    }
  }, [habit]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!habit || !name.trim()) return;
    setSubmitting(true);
    try {
      await updateHabit({
        id: habit._id,
        name: name.trim(),
        emoji,
        description: description.trim() || undefined,
      });
      toast.success("Habit updated!");
      onOpenChange(false);
    } catch {
      toast.error("Failed to update habit");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleArchive() {
    if (!habit) return;
    setArchiving(true);
    try {
      await archiveHabit({ id: habit._id });
      toast.success("Habit removed");
      onOpenChange(false);
    } catch {
      toast.error("Failed to remove habit");
    } finally {
      setArchiving(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[90svh]">
        <SheetHeader className="text-left mb-6">
          <SheetTitle>Edit Habit</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="px-4 pb-4 space-y-4">
          <div className="flex items-end gap-3">
            <div className="space-y-1.5">
              <Label>Icon</Label>
              <EmojiPickerInput value={emoji} onChange={setEmoji} />
            </div>
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="edit-habit-name">Name</Label>
              <Input
                id="edit-habit-name"
                placeholder="e.g. Morning run"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={50}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-habit-desc">
              Description{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </Label>
            <Textarea
              id="edit-habit-desc"
              placeholder="Why does this habit matter?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              maxLength={200}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={!name.trim() || submitting}
          >
            {submitting ? "Saving…" : "Save Changes"}
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="w-full gap-2"
            onClick={handleArchive}
            disabled={archiving}
          >
            <Trash2 className="h-4 w-4" />
            {archiving ? "Removing…" : "Remove Habit"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
