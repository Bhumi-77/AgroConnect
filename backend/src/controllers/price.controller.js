import axios from "axios";
import { prisma } from "../index.js";

export async function predictMarketPrice(req, res) {
  const { cropName, district, municipality, horizonDays = 7 } = req.body;

  if (!cropName || !district) {
    return res.status(400).json({ ok: false, error: "cropName and district are required" });
  }

  try {
    // support both env names (keep your current one)
    const mlUrl =
      process.env.ML_URL ||
      process.env.ML_SERVICE_URL ||
      "http://127.0.0.1:8000";

    // ✅ FastAPI expects: { product, horizonDays, district? }
    const { data } = await axios.post(`${mlUrl}/predict`, {
      product: cropName, // IMPORTANT: map cropName -> product
      district,
      horizonDays: Number(horizonDays),
    });

    if (!data?.ok) {
      return res.status(500).json({
        ok: false,
        error: "ML service failed",
        details: data,
      });
    }

    // ✅ Support both possible field names from ML
    const predicted =
      data.predictedPrice ?? // from my updated FastAPI
      data.predicted ??      // if your FastAPI still returns predicted
      data.predicted_price ?? null;

    if (predicted == null) {
      return res.status(500).json({
        ok: false,
        error: "ML response missing predicted value",
        details: data,
      });
    }

    // optional log in DB
    await prisma.pricePrediction.create({
      data: {
        cropName,
        district,
        municipality: municipality || null,
        horizonDays: Number(horizonDays),
        predicted: Number(predicted),
        confidence: data.confidence ?? 0.6,
        modelVersion: data.modelVersion || data.model || "v1.0",
        createdById: req.user?.id || null,
      },
    });

    // keep response shape same for frontend, but include predicted
    res.json({
      ok: true,
      predicted: Number(predicted),
      confidence: data.confidence ?? 0.6,
      modelVersion: data.modelVersion || data.model || "v1.0",
      raw: data, // helpful while debugging; you can remove later
    });
  } catch (e) {
    // ✅ show ML error response if exists
    const details =
      e?.response?.data?.detail ||
      e?.response?.data ||
      e?.message;

    res.status(500).json({
      ok: false,
      error: "Prediction failed",
      details,
    });
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

export async function createMarketPrice(req, res) {
  const { cropName, district, municipality, unit = "kg", price, date } = req.body;

  if (!cropName || !district || price == null) {
    return res.status(400).json({ ok: false, error: "cropName, district, price are required" });
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
