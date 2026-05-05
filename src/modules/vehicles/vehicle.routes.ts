import express from "express";

import * as ctrl from "./vehicle.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireAdmin } from "../middlewares/role.middleware";

const router = express.Router();

router.post("/", authMiddleware, requireAdmin, ctrl.createVehicle);
router.get("/", ctrl.getVehicles);
router.get("/:vehicleId", ctrl.getVehicle);
router.put("/:vehicleId", authMiddleware, requireAdmin, ctrl.updateVehicle);
router.delete("/:vehicleId", authMiddleware, requireAdmin, ctrl.deleteVehicle);

export const vehicleroutes = router;
