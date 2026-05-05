import { Router } from "express";
import * as ctrl from "./auth.controller";

const router = Router();

router.post("/signup", ctrl.signup);
router.post("/signin", ctrl.signin);

export default router;
