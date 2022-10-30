import { mutation, query } from './_generated/server';

export default mutation(async ({ db }, _id) => {
    await db.delete(_id);

    const holder = await db
        .query('holder')
        .filter(q => q.eq(q.field('id'), _id))
        .first();

    if (holder) {
        await db.delete(holder._id);
    }
});
