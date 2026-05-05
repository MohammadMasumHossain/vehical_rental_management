"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getAllUsers = void 0;
const db_1 = require("../../config/db");
const getAllUsers = async () => {
    const result = await db_1.pool.query(`SELECT id,name,email,phone,role FROM users`);
    return result.rows;
};
exports.getAllUsers = getAllUsers;
const updateUser = async (id, payload) => {
    const fields = [];
    const values = [];
    let index = 1;
    for (const key in payload) {
        fields.push(`${key}=$${index++}`);
        values.push(payload[key]);
    }
    values.push(id);
    const result = await db_1.pool.query(`UPDATE users SET ${fields.join(",")}
     WHERE id=$${index}
     RETURNING id,name,email,phone,role`, values);
    return result.rows[0];
};
exports.updateUser = updateUser;
const deleteUser = async (id) => {
    const bookings = await db_1.pool.query(`SELECT * FROM bookings WHERE customer_id=$1 AND status='active'`, [id]);
    if (bookings.rows.length > 0) {
        throw new Error("User has active bookings");
    }
    await db_1.pool.query(`DELETE FROM users WHERE id=$1`, [id]);
};
exports.deleteUser = deleteUser;
