import express from "express";

import * as ctrl from "./user.controller";

import { authMiddleware } from "../middlewares/auth.middleware";
import { requireAdmin } from "../middlewares/role.middleware";

const router = express.Router();

router.get("/", authMiddleware, requireAdmin, ctrl.getUsers);

router.put("/:userId", authMiddleware, ctrl.updateUser);

router.delete("/:userId", authMiddleware, requireAdmin, ctrl.deleteUser);

export const userRoutes = router;
