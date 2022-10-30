import { mutation, query } from './_generated/server';

export default query(async ({ db }) => {
    return await db.query('players').collect();
});
