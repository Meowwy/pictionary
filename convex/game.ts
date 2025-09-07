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