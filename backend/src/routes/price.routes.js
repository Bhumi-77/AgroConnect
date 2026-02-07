import { Router } from 'express';

// Demo AI price prediction endpoint.
// Replace with your real ML model/service later.
const router = Router();

const BASE = {
  vegetables: 120,
  fruits: 180,
  grains: 90,
  other: 100
};

router.get('/predict', async (req, res) => {
  const { category = 'other', qualityGrade = 'B', district = 'Unknown' } = req.query;

  const base = BASE[String(category)] ?? BASE.other;
  const qMult = String(qualityGrade).toUpperCase() === 'A' ? 1.15 : String(qualityGrade).toUpperCase() === 'C' ? 0.9 : 1.0;
  // small location adjustment (demo)
  const locMult = ['Kathmandu','Lalitpur','Bhaktapur'].includes(String(district)) ? 1.05 : 1.0;

  const predicted = Math.round(base * qMult * locMult);

  res.json({ ok:true, predictedPricePerKg: predicted, note: 'Demo prediction (replace with real model)' });
});

export default router;
