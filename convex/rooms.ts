import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const createRoom = mutation({
    args: {
        name: v.string(),
        password: v.optional(v.string()),
        player: v.string(),
    },
    handler: async (ctx, args) => {
        const roomId = await ctx.db.insert("game_rooms", {
            name: args.name,
            password: args.password,
        });

        // Also create the first player for the room
        await ctx.db.insert("players", {
            room_id: roomId,
            nickname: args.player,
        });

        return roomId;
},
});

export const getRooms = query({
    args: {},
    handler: async (ctx) => {
        return ctx.db.query("game_rooms").collect();
},
});

export const getPlayersInRoom = query({
  args: { roomId: v.id("game_rooms") },
  handler: async (ctx, args) => {
    return ctx.db
      .query("players")
      .filter((q) => q.eq(q.field("room_id"), args.roomId))
      .collect();
  },
});

export const getPlayers = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("players").collect();
  },
  });

