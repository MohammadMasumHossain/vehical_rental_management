import { pool } from "../../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signupUser = async (payload: any) => {
  // hash password
  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const result = await pool.query(
    `INSERT INTO users(name,email,password,phone,role)
     VALUES($1,$2,$3,$4,$5)
     RETURNING id,name,email,phone,role`,
    [
      payload.name,
      payload.email.toLowerCase(),
      hashedPassword,
      payload.phone,
      payload.role,
    ],
  );

  return result.rows[0];
};

export const signinUser = async (payload: any) => {
  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    payload.email.toLowerCase(),
  ]);

  const user = result.rows[0];

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(payload.password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" },
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  };
};
