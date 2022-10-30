import { mutation } from './_generated/server';

export default mutation(async ({ db }, _id) => {
    const _player = await db.get(_id);
    const player = {
        hasPotato: true,
        timestamp: Date.now(),
        numOfTimeHeldPotato: _player?.numOfTimeHeldPotato + 1 ?? 1,
        totalTimeHeld: Date.now() - (_player?.timestamp ?? 0) + (_player?.totalTimeHeld ?? 0)
    };

    await db.patch(_id, player);

    const holder = {
        id: _id
    };

    await db.insert('holder', holder);
});
