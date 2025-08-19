import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export interface Room {
  _id: string;
  name: string;
  hasPassword: boolean;
  playerCount: number;
}

export const createRoom = mutation({
    args: {
        name: v.string(),
        password: v.optional(v.string()),
        player: v.string(),
        deviceId: v.string(),
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
            admin: true,
            deviceId: args.deviceId,
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

export const getRoomByRoomName = query({
  args: { roomName: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("game_rooms")
      .filter((q) => q.eq(q.field("name"), args.roomName))
      .first();
  },
});


export const getPlayersInRoom = query({
  args: { roomId: v.optional(v.id("game_rooms")) },
  handler: async (ctx, args) => {
    if (!args.roomId) return [];
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

  export const joinRoom = mutation({
    args: {
      roomId: v.id("game_rooms"),
      nickname: v.string(),
      password: v.optional(v.union(v.string(), v.boolean())),
      deviceId: v.string(),
    },
    handler: async (ctx, args) => {
      const room = await ctx.db.get(args.roomId);
      if (!room) {
        throw new Error("Room not found");
      }
      else if ((room.password && room.password !== args.password) || args.password === false) {
        return "Incorrect password";
      }
      else {
        await ctx.db.insert("players", {
          room_id: args.roomId,
          nickname: args.nickname,
          admin: false,
          deviceId: args.deviceId,
          });
      }
    },
  });

