import { mutation } from './_generated/server';
import { performance } from 'node:perf_hooks';

export default mutation(async ({ db }, _id) => {
    performance.mark('receivesPotato');
    const player = {
        hasPotato: true,
        timestamp: Date.now(),
        numOfTimeHeldPotato: 1,
        totalTimeHeld: 0
    };
    await db.replace(_id, player);
    performance.measure('receivesPotato to Now', 'receivesPotato');
});