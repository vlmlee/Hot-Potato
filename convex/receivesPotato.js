import { mutation } from './_generated/server';

export default mutation(async ({ db }, _id) => {
    const player = {
        hasPotato: true,
        timestamp: Date.now(),
        numOfTimeHeldPotato: 1,
        totalTimeHeld: 0
    };

    await db.replace(_id, player);

    const holder = {
        id: _id
    };

    const potatoHolder = await db.query('holder').first();
    if (!potatoHolder) {
        await db.insert('holder', holder);
    } else {
        await db.replace(potatoHolder._id, holder);
    }
});
