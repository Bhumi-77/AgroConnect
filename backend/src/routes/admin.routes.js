import { Router } from 'express';
import { prisma } from '../index.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/dashboard', requireAuth, requireRole('ADMIN'), async (req, res) => {
  const [users, crops, orders] = await Promise.all([
    prisma.user.count(),
    prisma.crop.count(),
    prisma.order.count()
  ]);
  const pending = await prisma.user.count({ where: { isVerified: false } });
  res.json({ ok:true, stats: { users, crops, orders, unverifiedUsers: pending } });
});

router.get('/users', requireAuth, requireRole('ADMIN'), async (req, res) => {
  const users = await prisma.user.findMany({
    select: { id:true, fullName:true, email:true, role:true, isVerified:true, district:true, municipality:true, createdAt:true },
    orderBy: { createdAt: 'desc' }
  });
  res.json({ ok:true, users });
});

router.post('/users/:id/verify', requireAuth, requireRole('ADMIN'), async (req, res) => {
  const user = await prisma.user.update({ where: { id: req.params.id }, data: { isVerified: true } });
  res.json({ ok:true, user: { id:user.id, isVerified:user.isVerified } });
});

router.post('/crops/:id/toggle', requireAuth, requireRole('ADMIN'), async (req, res) => {
  const crop = await prisma.crop.findUnique({ where: { id: req.params.id } });
  if (!crop) return res.status(404).json({ ok:false, error:'Crop not found' });
  const updated = await prisma.crop.update({ where: { id: crop.id }, data: { isActive: !crop.isActive } });
  res.json({ ok:true, crop: updated });
});

router.get('/orders', requireAuth, requireRole('ADMIN'), async (req, res) => {
  const orders = await prisma.order.findMany({
    include: { items: { include: { crop: { include: { farmer: { select: { id:true, fullName:true } } } } } }, buyer: { select: { id:true, fullName:true } }, payment: true },
    orderBy: { createdAt: 'desc' }
  });
  res.json({ ok:true, orders });
});

export default router;
