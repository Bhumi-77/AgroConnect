import { Router } from 'express';
import { prisma } from '../index.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/me', requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id:true, fullName:true, email:true, role:true, phone:true, address:true, district:true, municipality:true, ward:true, latitude:true, longitude:true, language:true, isVerified:true, createdAt:true }
  });
  res.json({ ok:true, user });
});

router.put('/me', requireAuth, async (req, res) => {
  const { fullName, phone, address, district, municipality, ward, latitude, longitude, language } = req.body;
  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: { fullName, phone, address, district, municipality, ward, latitude, longitude, language },
    select: { id:true, fullName:true, email:true, role:true, phone:true, address:true, district:true, municipality:true, ward:true, latitude:true, longitude:true, language:true, isVerified:true }
  });
  res.json({ ok:true, user });
});

export default router;
