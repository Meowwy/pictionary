import { mutation } from "./_generated/server"
import { v } from "convex/values"

export interface Player {
    _id: string;
    room_id: string;
    nickname: string;
    score: number;
    admin: boolean;
    deviceId: string;
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