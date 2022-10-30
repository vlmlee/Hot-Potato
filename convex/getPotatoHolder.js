import { query } from "./_generated/server";

export default query(async ({ db }) => {
    performance.mark('getHolder');
    return await db.query("holder").collect();
});
