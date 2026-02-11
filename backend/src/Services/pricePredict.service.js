import { prisma } from "../index.js";

/**
 * Baseline AI-ish predictor:
 * - Uses last N days price history
 * - Moving average + trend (linear)
 * - Small seasonality factor (weekday)
 */
export async function predictPrice({ cropName, district, municipality, horizonDays = 7 }) {
  const N = 30;

  const history = await prisma.marketPrice.findMany({
    where: {
      cropName,
      district,
      ...(municipality ? { municipality } : {}),
    },
    orderBy: { date: "asc" },
    take: N,
  });

  if (history.length < 5) {
    return {
      ok: true,
      predicted: null,
      confidence: 0.2,
      reason: "Not enough history (need at least 5 records).",
    };
  }

  // prices array
  const prices = history.map((h) => h.price);

  // moving average (last 7)
  const last7 = prices.slice(-7);
  const ma7 = last7.reduce((a, b) => a + b, 0) / last7.length;

  // trend: simple slope using first vs last
  const first = prices[0];
  const last = prices[prices.length - 1];
  const slopePerDay = (last - first) / (prices.length - 1);

  // project
  let predicted = ma7 + slopePerDay * horizonDays;

  // simple weekday seasonality
  const today = new Date();
  const future = new Date(today);
  future.setDate(today.getDate() + horizonDays);
  const day = future.getDay(); // 0 Sun ... 6 Sat
  const seasonFactor = [0.98, 1.01, 1.02, 1.01, 1.00, 1.03, 0.99][day] || 1.0;
  predicted *= seasonFactor;

  // confidence based on how much data you have
  const confidence = Math.min(0.9, 0.45 + history.length / 80);

  return {
    ok: true,
    predicted: Number(predicted.toFixed(2)),
    confidence: Number(confidence.toFixed(2)),
    usedPoints: history.length,
    ma7: Number(ma7.toFixed(2)),
    slopePerDay: Number(slopePerDay.toFixed(3)),
  };
}
