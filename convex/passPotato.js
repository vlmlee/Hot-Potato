import {mutation, query} from "./_generated/server";
import { performance } from 'node:perf_hooks';
import {s} from "convex/schema";

export default mutation(async ({ db }, _from, _to) => {
    performance.mark('passPotato');
    const from = await db.query("player").filter(q => q.eq(q.field("id"), _from)).collect();
    const from_player = {
        hasPotato: false,
        timestamp: Date.now(),
        numOfTimeHeldPotato: (from?.numOfTimeHeldPotato + 1) ?? 1,
        totalTimeHeld: (Date.now() - (from?.timestamp ?? 0) + (from_player.totalTimeHeld ?? 0))
    };
    await db.patch(_from, from_player);

    const holder = { player_id: to };
    await db.patch("holder", holder);

    const to = await db.query("player").filter(q => q.eq(q.field("id"), _to)).collect();
    const player = {
        hasPotato: true,
        timestamp: Date.now(),
        numOfTimeHeldPotato: (to?.numOfTimeHeldPotato + 1) ?? 1,
        totalTimeHeld: (Date.now() - (to?.timestamp ?? 0) + (to.totalTimeHeld ?? 0))
    }
    await db.patch(_to, player);
    performance.measure('passPotato to Now', 'passPotato');
});