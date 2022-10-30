import { mutation, query } from './_generated/server';

export default mutation(async ({ db }, _id) => {
    await db.delete(_id);
});
