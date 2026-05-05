import { pool } from "../../config/db";

export const getAllUsers = async () => {
  const result = await pool.query(`SELECT id,name,email,phone,role FROM users`);
  return result.rows;
};

export const updateUser = async (id: number, payload: any) => {
  const fields = [];
  const values = [];
  let index = 1;

  for (const key in payload) {
    fields.push(`${key}=$${index++}`);
    values.push(payload[key]);
  }

  values.push(id);

  const result = await pool.query(
    `UPDATE users SET ${fields.join(",")}
     WHERE id=$${index}
     RETURNING id,name,email,phone,role`,
    values,
  );

  return result.rows[0];
};

export const deleteUser = async (id: number) => {
  const bookings = await pool.query(
    `SELECT * FROM bookings WHERE customer_id=$1 AND status='active'`,
    [id],
  );

  if (bookings.rows.length > 0) {
    throw new Error("User has active bookings");
  }

  await pool.query(`DELETE FROM users WHERE id=$1`, [id]);
};
