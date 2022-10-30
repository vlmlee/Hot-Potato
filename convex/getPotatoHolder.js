import { query } from './_generated/server';
import { performance } from 'node:perf_hooks';

export default query(async ({ db }) => {
    performance.mark('getHolder');
    return await db.query('holder').collect();
});
