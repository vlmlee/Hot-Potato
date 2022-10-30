import { mutation } from './_generated/server';

export default mutation(async ({ db }, _from, _to) => {
    performance.mark('passPotato');
    const from = await db
        .query('player')
        .filter(q => q.eq(q.field('id'), _from))
        .collect();
    const from_player = {
        hasPotato: false,
        timestamp: Date.now(),
        numOfTimeHeldPotato: from?.numOfTimeHeldPotato + 1 ?? 1,
        totalTimeHeld: Date.now() - (from?.timestamp ?? 0) + (from?.totalTimeHeld ?? 0)
    };
    await db.patch(_from, from_player);

    const holder = { player_id: _to };
    await db.patch('holder', holder);

    const to = await db
        .query('player')
        .filter(q => q.eq(q.field('id'), _to))
        .collect();
    const to_player = {
        hasPotato: true,
        timestamp: Date.now(),
        numOfTimeHeldPotato: to?.numOfTimeHeldPotato + 1 ?? 1,
        totalTimeHeld: Date.now() - (to?.timestamp ?? 0) + (to?.totalTimeHeld ?? 0)
    };
    await db.patch(_to, to_player);
    performance.measure('passPotato to Now', 'passPotato');
});
