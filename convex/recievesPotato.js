import { mutation } from './_generated/server';

export default mutation(async ({ db }, _id) => {
    window.performance.mark('receivesPotato');
    const player = {
        hasPotato: true,
        timestamp: Date.now(),
        numOfTimeHeldPotato: 1,
        totalTimeHeld: 0
    };
    await db.replace(_id, player);
    window.performance.measure('receivesPotato to Now', 'receivesPotato');
});
