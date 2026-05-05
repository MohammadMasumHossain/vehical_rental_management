import { Request, Response } from "express";
import * as service from "./user.service";

export const getUsers = async (_req: Request, res: Response) => {
  const data = await service.getAllUsers();

  res.json({
    success: true,
    message: "Users retrieved successfully",
    data,
  });
};

export const updateUser = async (req: any, res: Response) => {
  const userId = Number(req.params.userId);

  if (req.user.role !== "admin" && req.user.id !== userId) {
    return res.status(403).json({
      success: false,
      message: "Forbidden",
    });
  }

  const data = await service.updateUser(userId, req.body);

  res.json({
    success: true,
    message: "User updated successfully",
    data,
  });
};

export const deleteUser = async (req: any, res: Response) => {
  try {
    await service.deleteUser(Number(req.params.userId));

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
