import { query } from './_generated/server';

export default query(async ({ db }) => {
    window.performance.mark('Get players');
    return await db.query('players').collect();
});
