import { mutation } from './_generated/server';

export default mutation(async ({ db }, _id) => {
    const player = {
        hasPotato: true,
        timestamp: Date.now(),
        numOfTimeHeldPotato: 1,
        totalTimeHeld: 0
    };
    await db.patch(_id, player);
});
