import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  habits: defineTable({
    name: v.string(),
    emoji: v.string(),
    description: v.optional(v.string()),
    createdAt: v.number(),
    isArchived: v.boolean(),
    // Auth-ready: add userId: v.string()
  }).index("by_isArchived", ["isArchived"]),
  // Auth-ready: .index("by_user", ["userId", "isArchived"])

  habitLogs: defineTable({
    habitId: v.id("habits"),
    date: v.string(), // "YYYY-MM-DD" string — no TZ math needed server-side
    completedAt: v.number(),
    // Auth-ready: add userId: v.string()
  })
    .index("by_habit_date", ["habitId", "date"])
    .index("by_date", ["date"]),
  // Auth-ready: .index("by_user_date", ["userId", "date"])
});
