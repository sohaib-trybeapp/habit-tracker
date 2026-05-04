import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { formatDate } from "./utils";

export const getCompletionsForDate = query({
  args: { date: v.string() },
  // Auth-ready: add userId arg, filter by it
  handler: async (ctx, args) => {
    return await ctx.db
      .query("habitLogs")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .collect();
  },
});

export const getStreakForHabit = query({
  args: { habitId: v.id("habits") },
  handler: async (ctx, args) => {
    const logs = await ctx.db
      .query("habitLogs")
      .withIndex("by_habit_date", (q) => q.eq("habitId", args.habitId))
      .collect();

    if (logs.length === 0) return 0;

    const completedDates = new Set(logs.map((l) => l.date));
    const today = new Date();

    // Grace period: if today isn't done yet, start counting from yesterday
    // so we don't zero the streak just because the user hasn't opened the app yet
    const startOffset = completedDates.has(formatDate(today)) ? 0 : 1;

    let streak = 0;
    for (let i = startOffset; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      if (completedDates.has(formatDate(d))) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  },
});

export const toggleToday = mutation({
  args: {
    habitId: v.id("habits"),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("habitLogs")
      .withIndex("by_habit_date", (q) =>
        q.eq("habitId", args.habitId).eq("date", args.date)
      )
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
      return "uncompleted" as const;
    } else {
      await ctx.db.insert("habitLogs", {
        habitId: args.habitId,
        date: args.date,
        completedAt: Date.now(),
      });
      return "completed" as const;
    }
  },
});
