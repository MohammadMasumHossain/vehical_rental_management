import express from "express";
import * as ctrl from "./booking.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/", authMiddleware, ctrl.createBooking);
router.get("/", authMiddleware, ctrl.getBookings);
router.put("/:bookingId", authMiddleware, ctrl.updateBooking);

export const bookingRoute = router;
