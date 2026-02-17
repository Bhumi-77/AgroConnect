import axios from "axios";
import { prisma } from "../index.js";

export async function predictMarketPrice(req, res) {
  const { cropName, horizonDays = 7 } = req.body;

  if (!cropName) {
    return res.status(400).json({ ok: false, error: "cropName is required" });
  }

  try {
    const mlUrl = process.env.ML_URL || "http://127.0.0.1:8000";

    const { data } = await axios.post(`${mlUrl}/predict`, {
      product: cropName,
      horizonDays: Number(horizonDays),
    });

    if (!data?.ok) {
      return res.status(500).json({ ok: false, error: "ML service failed", details: data });
    }

    res.json({
      ok: true,
      predicted: data.predicted,
      confidence: data.confidence ?? 0.6,
      modelVersion: data.modelVersion || "v1.0",
    });
  } catch (e) {
    res.status(500).json({
      ok: false,
      error: "Prediction failed",
      details: e?.response?.data || e?.message,
    });
  }
}



export async function getMlProducts(req, res) {
  try {
    const mlUrl = process.env.ML_URL || "http://127.0.0.1:8000";
    const { data } = await axios.get(`${mlUrl}/products`);
    return res.json(data);
  } catch (e) {
    return res.status(500).json({ ok: false, error: "Failed to load products" });
  }
}

export async function listMarketPrices(req, res) {
  const { cropName, district, take = 60 } = req.query;

  const prices = await prisma.marketPrice.findMany({
    where: {
      ...(cropName ? { cropName } : {}),
      ...(district ? { district } : {}),
    },
    orderBy: { date: "desc" },
    take: Number(take),
  });

  res.json({ ok: true, prices });
}

export async function getPriceProducts(req, res) {
  try {
    const mlUrl =
      process.env.ML_URL ||
      process.env.ML_SERVICE_URL ||
      "http://127.0.0.1:8000";

    const { data } = await axios.get(`${mlUrl}/products`);

    // Expect FastAPI to return: { ok:true, products:[...] } OR just [...]
    const products = Array.isArray(data)
      ? data
      : Array.isArray(data?.products)
      ? data.products
      : [];

    return res.json({ ok: true, products });
  } catch (e) {
    return res.status(500).json({
      ok: false,
      error: "Failed to load products from ML service",
      details: e?.response?.data || e?.message,
    });
  }
}

export async function createMarketPrice(req, res) {
  const { cropName, district, municipality, unit = "kg", price, date } = req.body;

  if (!cropName || !district || price == null) {
    return res.status(400).json({
      ok: false,
      error: "cropName, district, price are required",
    });
  }

  const row = await prisma.marketPrice.create({
    data: {
      cropName,
      district,
      municipality: municipality || null,
      unit,
      price: Number(price),
      date: date ? new Date(date) : new Date(),
    },
  });

  res.json({ ok: true, price: row });
}
