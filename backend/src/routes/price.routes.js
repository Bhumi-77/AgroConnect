import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  listMarketPrices,
  createMarketPrice,
  predictMarketPrice,
  getPriceProducts, // ✅ add this
} from "../controllers/price.controller.js";

const router = Router();

router.get("/", listMarketPrices);
router.post("/", requireAuth, createMarketPrice);

// ✅ products list for dropdown (no auth needed)
router.get("/products", getPriceProducts);

router.post("/predict", requireAuth, predictMarketPrice);

export default router;
