import axios from "axios";
import { prisma } from "../index.js";

export async function predictMarketPrice(req, res) {
  const { cropName, district, municipality, horizonDays = 7 } = req.body;

  if (!cropName || !district) {
    return res.status(400).json({ ok: false, error: "cropName and district are required" });
  }

  try {
    const mlUrl = process.env.ML_URL || "http://localhost:8000";

    const { data } = await axios.post(`${mlUrl}/predict`, {
      cropName,
      district,
      horizonDays: Number(horizonDays),
    });

    if (!data?.ok) {
      return res.status(500).json({ ok: false, error: "ML service failed" });
    }

    // optional log in DB
    await prisma.pricePrediction.create({
      data: {
        cropName,
        district,
        municipality: municipality || null,
        horizonDays: Number(horizonDays),
        predicted: data.predicted,
        confidence: data.confidence ?? 0.6,
        modelVersion: data.modelVersion || "v1.0",
        createdById: req.user?.id || null,
      },
    });

    res.json({ ok: true, ...data });
  } catch (e) {
    res.status(500).json({
      ok: false,
      error: "Prediction failed",
      details: e?.message,
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
