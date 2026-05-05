"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVehicle = exports.updateVehicle = exports.getVehicleById = exports.getAllVehicles = exports.createVehicle = void 0;
const db_1 = require("../../config/db");
const createVehicle = async (payload) => {
    const result = await db_1.pool.query(`INSERT INTO vehicles(vehicle_name,type,registration_number,daily_rent_price,availability_status)
     VALUES($1,$2,$3,$4,$5)
     RETURNING *`, [
        payload.vehicle_name,
        payload.type,
        payload.registration_number,
        payload.daily_rent_price,
        payload.availability_status || "available",
    ]);
    return result.rows[0];
};
exports.createVehicle = createVehicle;
const getAllVehicles = async () => {
    const result = await db_1.pool.query(`SELECT * FROM vehicles ORDER BY id DESC`);
    return result.rows;
};
exports.getAllVehicles = getAllVehicles;
const getVehicleById = async (id) => {
    const result = await db_1.pool.query(`SELECT * FROM vehicles WHERE id=$1`, [id]);
    return result.rows[0];
};
exports.getVehicleById = getVehicleById;
const updateVehicle = async (id, payload) => {
    const fields = [];
    const values = [];
    let index = 1;
    for (const key in payload) {
        fields.push(`${key}=$${index++}`);
        values.push(payload[key]);
    }
    // 🔴 FIX: handle empty body
    if (fields.length === 0) {
        throw new Error("No fields provided for update");
    }
    values.push(id);
    const result = await db_1.pool.query(`UPDATE vehicles SET ${fields.join(",")} WHERE id=$${index} RETURNING *`, values);
    return result.rows[0];
};
exports.updateVehicle = updateVehicle;
const deleteVehicle = async (id) => {
    const bookings = await db_1.pool.query(`SELECT * FROM bookings WHERE vehicle_id=$1 AND status='active'`, [id]);
    if (bookings.rows.length > 0) {
        throw new Error("Vehicle has active bookings");
    }
    const result = await db_1.pool.query(`DELETE FROM vehicles WHERE id=$1 RETURNING *`, [id]);
    if (result.rows.length === 0) {
        throw new Error("Vehicle not found");
    }
};
exports.deleteVehicle = deleteVehicle;
