import { query } from './_generated/server';

export default query(async ({ db }) => {
    window.performance.mark('getHolder');
    return await db.query('holder').collect();
});
