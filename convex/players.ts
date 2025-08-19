import { mutation } from "./_generated/server"
import { v } from "convex/values"

export const addNewPlayer = mutation({
    args: {
        room_id: v.id("game_rooms"),
        nickname: v.string(),
        admin: v.boolean(),
    },
    handler: async (ctx, args) => {
        const room = await ctx.db.insert("players", {
            room_id: args.room_id,
            nickname: args.nickname,
            admin: args.admin,
        });
},
});