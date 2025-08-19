import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"


export default defineSchema({
    game_rooms: defineTable({
        name: v.string(),
        password: v.optional(v.string()),
    }),

    players: defineTable({
        room_id: v.id("game_rooms"),
        nickname: v.string(),
        admin: v.boolean(),
        score: v.optional(v.number()),
    })
});