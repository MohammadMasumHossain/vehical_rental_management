import { pool } from "../../config/db";

export const createBooking = async (payload: any, user: any) => {
  const vehicleRes = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [
    payload.vehicle_id,
  ]);

  if (!vehicleRes.rows.length) {
    throw new Error("Vehicle not found");
  }

  const vehicle = vehicleRes.rows[0];

  // ❌ already booked check
  if (vehicle.availability_status === "booked") {
    throw new Error("Vehicle is already booked");
  }

  const start = new Date(payload.rent_start_date);
  const end = new Date(payload.rent_end_date);

  if (end <= start) {
    throw new Error("End date must be after start date");
  }

  const days = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );

  const total = days * vehicle.daily_rent_price;

  // 🔴 FIX: enforce customer from token (NOT body)
  const customerId = user.id;

  const result = await pool.query(
    `INSERT INTO bookings
     (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
     VALUES ($1,$2,$3,$4,$5,'active')
     RETURNING *`,
    [
      customerId,
      payload.vehicle_id,
      payload.rent_start_date,
      payload.rent_end_date,
      total,
    ],
  );

  await pool.query(
    `UPDATE vehicles SET availability_status='booked' WHERE id=$1`,
    [payload.vehicle_id],
  );

  return {
    ...result.rows[0],
    vehicle: {
      vehicle_name: vehicle.vehicle_name,
      daily_rent_price: vehicle.daily_rent_price,
    },
  };
};

export const getBookings = async (user: any) => {
  await pool.query(`
    UPDATE bookings
    SET status='returned'
    WHERE rent_end_date < CURRENT_DATE AND status='active'
  `);

  await pool.query(`
    UPDATE vehicles
    SET availability_status='available'
    WHERE id IN (
      SELECT vehicle_id FROM bookings WHERE status='returned'
    )
  `);

  if (user.role === "admin") {
    const result = await pool.query(`
      SELECT 
        b.id,
        b.customer_id,
        b.vehicle_id,
        b.rent_start_date,
        b.rent_end_date,
        b.total_price,
        b.status,
        u.name AS customer_name,
        u.email AS customer_email,
        v.vehicle_name,
        v.registration_number
      FROM bookings b
      JOIN users u ON b.customer_id = u.id
      JOIN vehicles v ON b.vehicle_id = v.id
      ORDER BY b.id DESC
    `);

    return result.rows.map((row) => ({
      id: row.id,
      customer_id: row.customer_id,
      vehicle_id: row.vehicle_id,
      rent_start_date: row.rent_start_date,
      rent_end_date: row.rent_end_date,
      total_price: row.total_price,
      status: row.status,
      customer: {
        name: row.customer_name,
        email: row.customer_email,
      },
      vehicle: {
        vehicle_name: row.vehicle_name,
        registration_number: row.registration_number,
      },
    }));
  }

  const result = await pool.query(
    `
    SELECT 
      b.id,
      b.vehicle_id,
      b.rent_start_date,
      b.rent_end_date,
      b.total_price,
      b.status,
      v.vehicle_name,
      v.registration_number,
      v.type
    FROM bookings b
    JOIN vehicles v ON b.vehicle_id = v.id
    WHERE b.customer_id = $1
    ORDER BY b.id DESC
    `,
    [user.id],
  );

  return result.rows.map((row) => ({
    id: row.id,
    vehicle_id: row.vehicle_id,
    rent_start_date: row.rent_start_date,
    rent_end_date: row.rent_end_date,
    total_price: row.total_price,
    status: row.status,
    vehicle: {
      vehicle_name: row.vehicle_name,
      registration_number: row.registration_number,
      type: row.type,
    },
  }));
};

export const updateBooking = async (id: number, status: string, user: any) => {
  const bookingRes = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [
    id,
  ]);

  const booking = bookingRes.rows[0];

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.status !== "active") {
    throw new Error("Booking already completed or cancelled");
  }

  if (user.role === "customer") {
    // must own booking
    if (booking.customer_id !== user.id) {
      throw new Error("Forbidden");
    }

    if (status !== "cancelled") {
      throw new Error("Customers can only cancel bookings");
    }

    if (new Date() >= new Date(booking.rent_start_date)) {
      throw new Error("Cannot cancel after booking start date");
    }
  }

  if (user.role === "admin") {
    if (status !== "returned") {
      throw new Error("Admin can only mark as returned");
    }
  }

  const result = await pool.query(
    `UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`,
    [status, id],
  );

  let vehicleData = null;

  if (status === "returned" || status === "cancelled") {
    const vehicleRes = await pool.query(
      `UPDATE vehicles 
       SET availability_status='available' 
       WHERE id=$1 
       RETURNING availability_status`,
      [booking.vehicle_id],
    );

    vehicleData = vehicleRes.rows[0];
  }

  return {
    ...result.rows[0],
    ...(status === "returned" && { vehicle: vehicleData }),
  };
};
