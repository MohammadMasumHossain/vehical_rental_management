import { Request, Response } from "express";
import * as service from "./auth.service";

export const signup = async (req: Request, res: Response) => {
  try {
    const user = await service.signupUser(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const data = await service.signinUser(req.body);

    res.json({
      success: true,
      message: "Login successful",
      data,
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};
