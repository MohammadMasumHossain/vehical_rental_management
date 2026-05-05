import { Request, Response } from "express";
import * as service from "./booking.service";

export const createBooking = async (req: any, res: Response) => {
  try {
    const data = await service.createBooking(req.body, req.user);

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getBookings = async (req: any, res: Response) => {
  try {
    const data = await service.getBookings(req.user);

    res.json({
      success: true,
      message:
        req.user.role === "admin"
          ? "Bookings retrieved successfully"
          : "Your bookings retrieved successfully",
      data,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateBooking = async (req: any, res: Response) => {
  try {
    const data = await service.updateBooking(
      Number(req.params.bookingId),
      req.body.status,
      req.user,
    );

    res.json({
      success: true,
      message:
        req.body.status === "cancelled"
          ? "Booking cancelled successfully"
          : "Booking marked as returned. Vehicle is now available",
      data,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
