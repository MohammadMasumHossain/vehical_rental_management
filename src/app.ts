import express, { Request, Response } from "express";

import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";
import config from "./config";
import initDB from "./config/db";
import authRoutes from "./modules/auth/auth.routes";
import { userRoutes } from "./modules/users/user.routes";
import { vehicleroutes } from "./modules/vehicles/vehicle.routes";
import { bookingRoute } from "./modules/bookings/booking.routes";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const app = express();
initDB();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello! welcome to rental vehicel systems!");
});
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/vehicles", vehicleroutes);
app.use("/api/v1/bookings", bookingRoute);

export default app;
