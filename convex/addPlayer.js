import { mutation, query } from './_generated/server';

export default mutation(async ({ db }) => {
    const player = {
        hasPotato: false,
        timestamp: Date.now(),
        numOfTimeHeldPotato: 0,
        totalTimeHeld: 0
    };

    await db.insert('players', player);
});
