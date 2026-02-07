import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { listMyOrders, getMyOrderById } from "../controllers/buyerOrders.controller.js";

const router = Router();

// Buyer orders
router.get("/buyer/my", requireAuth, requireRole("BUYER"), listMyOrders);

// Buyer order detail
router.get("/buyer/:id", requireAuth, requireRole("BUYER"), getMyOrderById);

export default router;
