import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"


export default defineSchema({
    game_rooms: defineTable({
        name: v.string(),
        password: v.optional(v.string()),
        gameMode: v.string(),
        state: v.string(),
    }),

    players: defineTable({
        room_id: v.id("game_rooms"),
        nickname: v.string(),
        admin: v.boolean(),
        score: v.optional(v.number()),
        deviceId: v.string(),
        order: v.optional(v.number()),
    }),

    game: defineTable({
        room_id: v.id("game_rooms"),
        currentlyDrawing: v.id("players"),
        currentRound: v.number(),
        currentCategory: v.optional(v.string()),
        guessingPrompts: v.optional(v.array(
            v.object(
                {
                    prompt: v.string(),
                    category: v.string(),
                    used: v.boolean(),
                }
            )
        )),
    }),

    guessingPrompts: defineTable({
        room_id: v.id("game"),

    }),
})