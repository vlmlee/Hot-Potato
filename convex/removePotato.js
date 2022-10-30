import { mutation } from './_generated/server';

export default mutation(async ({ db }, holder) => {
    const from = await db.get(holder.id);
    const updatedFromPlayer = {
        hasPotato: false,
        timestamp: Date.now(),
        numOfTimeHeldPotato: from?.numOfTimeHeldPotato + 1 ?? 1,
        totalTimeHeld: Date.now() - (from?.timestamp ?? 0) + (from?.totalTimeHeld ?? 0)
    };
    await db.patch(from._id, updatedFromPlayer);

    await db.delete(holder._id);
});
