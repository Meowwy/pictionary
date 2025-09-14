import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const savePrompts = mutation({
  args: {
    game_id: v.id("game"),
    theme: v.string(),
    prompt: v.string(),
    type: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("guessingPrompts", {
      game_id: args.game_id,
      theme: args.theme,
      prompt: args.prompt,
      used: false,
      type: args.type,
    });
  },
});