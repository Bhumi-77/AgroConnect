import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";

import {
  initiateEsewa,
  esewaSuccess,
  esewaFailure,
} from "../controllers/paymentEsewa.controller.js";

const router = Router();

// buyer initiates (✅ only BUYER should be allowed)
router.post("/esewa/initiate", requireAuth, requireRole("BUYER"), initiateEsewa);

// esewa redirects back
router.get("/esewa/success", esewaSuccess);
router.get("/esewa/failure", esewaFailure);

export default router;
