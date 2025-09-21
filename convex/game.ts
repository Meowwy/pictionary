import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const startGame = mutation({
    args: {
        roomId: v.id("game_rooms"),
    },
    handler: async (ctx, args) => {
      await ctx.db.patch(args.roomId, {state: "game"})

      const checkGame = await ctx.db
        .query("game")
        .filter(q => q.eq(q.field("room_id"), args.roomId))
        .first()

      if(checkGame){
        throw new Error("Game already exists");
      }

       const players = await ctx.db
      .query("players")
      .filter((q) => q.eq(q.field("room_id"), args.roomId))
      .collect();

      // shuffle players array
      const shuffled = players
      .map((p) => ({ ...p }))
      .sort(() => Math.random() - 0.5);

      // assign order numbers 1..N
      for (let i = 0; i < shuffled.length; i++) {
        await ctx.db.patch(shuffled[i]._id, {
          order: i + 1,
        });
      }
      
      const gameId = await ctx.db.insert("game", {
        room_id: args.roomId,
        currentRound: 1,
        currentlyDrawing: shuffled[0]._id,
      });
    return gameId;
    },
})

export const getGameByRoomId = query({
    args: {
        roomId: v.id("game_rooms"),
    },
    handler: async (ctx, args) => {
        return ctx.db.query("game")
        .filter((q) => q.eq(q.field("room_id"), args.roomId))
        .first();
},
});

export const getGame = query({
    args: {
        gameId: v.id("game"),
    },
    handler: async (ctx, args) => {
        return ctx.db.query("game")
        .filter((q) => q.eq(q.field("_id"), args.gameId))
        .first();
},
});

export const getDrawingPromptsSimple = query({
  args: {
    gameId: v.id("game"),
    selectedCategory: v.string(),
  },
  handler: async (ctx, args) => {
    return ctx.db
      .query("guessingPrompts")
      .filter((q) => q.eq(q.field("game_id"), args.gameId))
      .filter((q) => q.eq(q.field("theme"), args.selectedCategory))
      .filter((q) => q.eq(q.field("type"), "simple"))
      .filter((q) => q.eq(q.field("used"), false))
      .take(2);
  },
});

export const getDrawingPromptsActivity = query({
  args: {
    gameId: v.id("game"),
    selectedCategory: v.string(),
  },
  handler: async (ctx, args) => {
    return ctx.db
      .query("guessingPrompts")
      .filter((q) => q.eq(q.field("game_id"), args.gameId))
      .filter((q) => q.eq(q.field("theme"), args.selectedCategory))
      .filter((q) => q.eq(q.field("type"), "activity"))
      .filter((q) => q.eq(q.field("used"), false))
      .take(2);
  },
});

export const markPromptsUsed = mutation({
  args: {
    promptIds: v.array(v.id("guessingPrompts")),
  },
  handler: async (ctx, args) => {
    for (const id of args.promptIds) {
      await ctx.db.patch(id, { used: true });
    }
  },
});

export const getDrawingThemes = query({
  args: {
    gameId: v.id("game"),
  },
  handler: async (ctx, args) => {
    const prompts = await ctx.db
      .query("guessingPrompts")
      .filter((q) => q.eq(q.field("game_id"), args.gameId))
      .collect();

    // Separate by type
    const simpleThemes = [
      ...new Set(
        prompts
          .filter((p) => p.type === "simple")
          .map((p) => p.theme)
      ),
    ];

    const activityThemes = [
      ...new Set(
        prompts
          .filter((p) => p.type === "activities")
          .map((p) => p.theme)
      ),
    ];

    return {
      Simple: simpleThemes,
      Activities: activityThemes,
    };
  },
});

export const increasePlayerScore = mutation({
  args: {
    playerId: v.id("players"),
    increaseBy: v.number(),
  },
  handler: async (ctx, args) => {
    const player = await ctx.db.get(args.playerId);
    if (!player) throw new Error("Player not found");

    await ctx.db.patch(args.playerId, {
      score: (player.score ?? 0) + args.increaseBy,
    });
  },
});

export const changeDrawingPlayer = mutation({
  args: {
    gameId: v.id("game"),
    playerId: v.id("players"),
  },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game) throw new Error("Game not found");

    await ctx.db.patch(args.gameId, {
      currentlyDrawing: args.playerId,
    });
  },
});