import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export interface Player {
    _id: string;
    room_id: string;
    nickname: string;
    score: number;
    admin: boolean;
    deviceId: string;
}

export interface PlayerForSelection {
    _id: string;
    nickname: string;
    order: number;
    isLocal: boolean;
}


export const addNewPlayer = mutation({
    args: {
        room_id: v.id("game_rooms"),
        nickname: v.string(),
        admin: v.boolean(),
        deviceId: v.string(),
    },
    handler: async (ctx, args) => {
        const room = await ctx.db.insert("players", {
            room_id: args.room_id,
            nickname: args.nickname,
            admin: args.admin,
            deviceId: args.deviceId,
        });
},
});

export const getlocalPlayer = query({
    args: {
        deviceId: v.string(),
        roomId: v.id("game_rooms"),
    },
    handler: async (ctx, args) => {
        return ctx.db.query("players")
        .filter((q) => q.eq(q.field("deviceId"), args.deviceId))
        .filter((q) => q.eq(q.field("room_id"), args.roomId))
        .first();
},
});

export const getlocalPlayerForRouting = query({
    args: {
        deviceId: v.string(),
    },
    handler: async (ctx, args) => {
        return ctx.db.query("players")
        .filter((q) => q.eq(q.field("deviceId"), args.deviceId))
        .first();
},
});

export const getDrawingPlayer = query({
    args: {
        gameId: v.id("game"),
    },
    handler: async (ctx, args) => { 
        const game = await ctx.db.get(args.gameId);
        if (!game) throw new Error("Game not found");

        const player = await ctx.db.get(game.currentlyDrawing);
        if (!player) throw new Error("Player not found");

        return player;
},
});