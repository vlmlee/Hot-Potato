import { query } from "./_generated/server";

export default query(async ({ db }, input) => {
    const message = await db.query("messages").filter(q => q.eq(q.field("body"), input)).unique();

    if (message) return message;
    return '';
});