import { Request, Response } from "express";
import * as service from "./vehicle.service";

export const createVehicle = async (req: Request, res: Response) => {
  const data = await service.createVehicle(req.body);

  res.status(201).json({
    success: true,
    message: "Vehicle created successfully",
    data,
  });
};

export const getVehicles = async (_req: Request, res: Response) => {
  const data = await service.getAllVehicles();

  res.json({
    success: true,
    message: data.length
      ? "Vehicles retrieved successfully"
      : "No vehicles found",
    data,
  });
};

export const getVehicle = async (req: Request, res: Response) => {
  const data = await service.getVehicleById(Number(req.params.vehicleId));

  res.json({
    success: true,
    message: "Vehicle retrieved successfully",
    data,
  });
};

export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const data = await service.updateVehicle(
      Number(req.params.vehicleId),
      req.body,
    );

    res.json({
      success: true,
      message: "Vehicle updated successfully",
      data,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  await service.deleteVehicle(Number(req.params.vehicleId));

  res.json({
    success: true,
    message: "Vehicle deleted successfully",
  });
};
