import { defineSchema, defineTable, s } from 'convex/schema';

export default defineSchema({
    players: defineTable({
        hasPotato: s.boolean(),
        timestamp: s.number(),
        numOfTimeHeldPotato: s.number(),
        totalTimeHeld: s.number()
    }),
    holder: defineTable({
        id: s.id('players')
    })
});
