import { mutation } from './_generated/server';

export default mutation(async ({ db }, holder, _to) => {
    const from = await db.get(holder.id);
    const updatedFromPlayer = {
        hasPotato: false,
        timestamp: Date.now(),
        numOfTimeHeldPotato: from?.numOfTimeHeldPotato + 1 ?? 1,
        totalTimeHeld: Date.now() - (from?.timestamp ?? 0) + (from?.totalTimeHeld ?? 0)
    };
    await db.patch(from._id, updatedFromPlayer);

    const _holder = { id: _to };
    await db.patch(holder._id, _holder);

    const to = await db.get(_to);
    const to_player = {
        hasPotato: true,
        timestamp: Date.now(),
        numOfTimeHeldPotato: to?.numOfTimeHeldPotato + 1 ?? 1,
        totalTimeHeld: Date.now() - (to?.timestamp ?? 0) + (to?.totalTimeHeld ?? 0)
    };
    await db.patch(_to, to_player);
});
