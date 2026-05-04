"use client";

import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmojiPickerInput } from "@/components/EmojiPickerInput";
import { Plus } from "lucide-react";

interface AddHabitDialogProps {
  trigger?: React.ReactElement<{ onClick?: React.MouseEventHandler }>;
}

export function AddHabitDialog({ trigger }: AddHabitDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("✨");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const createHabit = useMutation(api.habits.create);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      await createHabit({
        name: name.trim(),
        emoji,
        description: description.trim() || undefined,
      });
      toast.success("Habit created!");
      setOpen(false);
      setName("");
      setEmoji("✨");
      setDescription("");
    } catch {
      toast.error("Failed to create habit");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {trigger ? (
        React.cloneElement(trigger, { onClick: () => setOpen(true) })
      ) : (
        <SheetTrigger render={<Button size="sm" className="gap-2" />}>
          <Plus className="h-4 w-4" />
          Add Habit
        </SheetTrigger>
      )}
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[90svh]">
        <SheetHeader className="text-left mb-6">
          <SheetTitle>New Habit</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="px-4 pb-4 space-y-4">
          <div className="flex items-end gap-3">
            <div className="space-y-1.5">
              <Label>Icon</Label>
              <EmojiPickerInput value={emoji} onChange={setEmoji} />
            </div>
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="habit-name">Name</Label>
              <Input
                id="habit-name"
                placeholder="e.g. Morning run"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={50}
                autoFocus
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="habit-desc">
              Description{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </Label>
            <Textarea
              id="habit-desc"
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
            {submitting ? "Creating…" : "Create Habit"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
