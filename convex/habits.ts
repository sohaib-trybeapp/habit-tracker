import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  // Auth-ready: add args: { userId: v.string() }, filter by userId
  handler: async (ctx) => {
    return await ctx.db
      .query("habits")
      .withIndex("by_isArchived", (q) => q.eq("isArchived", false))
      .order("asc")
      .collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    emoji: v.string(),
    description: v.optional(v.string()),
  },
  // Auth-ready: add userId arg, write to document
  handler: async (ctx, args) => {
    return await ctx.db.insert("habits", {
      name: args.name,
      emoji: args.emoji,
      description: args.description,
      createdAt: Date.now(),
      isArchived: false,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("habits"),
    name: v.optional(v.string()),
    emoji: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  // Auth-ready: verify habit.userId === identity.subject before patching
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    const patch = Object.fromEntries(
      Object.entries(fields).filter(([, val]) => val !== undefined)
    );
    await ctx.db.patch(id, patch);
  },
});

export const archive = mutation({
  args: { id: v.id("habits") },
  // Auth-ready: verify ownership
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { isArchived: true });
  },
});
