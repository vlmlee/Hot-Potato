import { mutation, query } from './_generated/server';

export default mutation(async ({ db }) => {
    return await db.query('holder').collect();
});
