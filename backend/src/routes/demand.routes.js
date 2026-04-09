import { Router } from 'express';
import { prisma } from '../index.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

/* =========================================================
   POST DEMAND REQUEST (BUYER)
   POST /api/demands
========================================================= */
router.post('/', requireAuth, requireRole('BUYER', 'ADMIN'), async (req, res) => {
  try {
    const {
      cropName,
      quantity,
      unit,
      budget,
      preferredDistrict,
      preferredMunicipality,
      deliveryAddress,
      description,
      buyerName,
      buyerPhone,
    } = req.body;

    if (!cropName?.trim()) return res.status(400).json({ ok: false, error: 'Crop name is required' });
    if (!quantity || Number(quantity) <= 0) return res.status(400).json({ ok: false, error: 'Quantity must be greater than 0' });
    if (!unit?.trim()) return res.status(400).json({ ok: false, error: 'Unit is required' });
    if (!buyerName?.trim()) return res.status(400).json({ ok: false, error: 'Buyer name is required' });
    if (!buyerPhone?.trim()) return res.status(400).json({ ok: false, error: 'Phone is required' });
    if (!preferredDistrict?.trim()) return res.status(400).json({ ok: false, error: 'District is required' });
    if (!deliveryAddress?.trim()) return res.status(400).json({ ok: false, error: 'Delivery address is required' });

    const demand = await prisma.demandPost.create({
      data: {
        buyerId: req.user.id,
        cropName: cropName.trim(),
        quantity: Number(quantity),
        unit: unit.trim(),
        budget: budget ? Number(budget) : null,
        preferredDistrict: preferredDistrict.trim(),
        preferredMunicipality: preferredMunicipality?.trim() || null,
        deliveryAddress: deliveryAddress.trim(),
        description: description?.trim() || null,
        buyerName: buyerName.trim(),
        buyerPhone: buyerPhone.trim(),
      }
    });

    res.status(201).json({ ok: true, message: 'Demand posted successfully', demand });
  } catch (error) {
    console.error('POST /api/demands error:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

/* =========================================================
   GET MY DEMAND POSTS (BUYER)
   GET /api/demands/my
========================================================= */
router.get('/my', requireAuth, requireRole('BUYER', 'ADMIN'), async (req, res) => {
  try {
    const demands = await prisma.demandPost.findMany({
      where: { buyerId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ ok: true, demands });
  } catch (error) {
    console.error('GET /api/demands/my error:', error);
    res.status(500).json({ ok: false, error: 'Failed to fetch your demand posts' });
  }
});

/* =========================================================
   GET ALL DEMAND POSTS (PUBLIC / FARMER / ADMIN / BUYER)
   GET /api/demands
========================================================= */
router.get('/', async (req, res) => {
  try {
    const { category, district, municipality } = req.query;

    const where = {
      ...(category ? { category: String(category) } : {}),
      ...(district ? { district: String(district) } : {}),
      ...(municipality ? { municipality: String(municipality) } : {})
    };

    const demands = await prisma.demandPost.findMany({
      where,
      include: {
        buyer: {
          select: {
            id: true,
            fullName: true,
            district: true,
            municipality: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ ok: true, demands });
  } catch (error) {
    console.error('GET /api/demands error:', error);
    res.status(500).json({ ok: false, error: 'Failed to fetch demand posts' });
  }
});

/* =========================================================
   DELETE MY DEMAND POST (BUYER)
   DELETE /api/demands/:id
========================================================= */
router.delete('/:id', requireAuth, requireRole('BUYER', 'ADMIN'), async (req, res) => {
  try {
    const demand = await prisma.demandPost.findUnique({
      where: { id: req.params.id }
    });

    if (!demand) {
      return res.status(404).json({ ok: false, error: 'Demand post not found' });
    }

    // Buyer can only delete own demand post (admin can delete any)
    if (req.user.role !== 'ADMIN' && demand.buyerId !== req.user.id) {
      return res.status(403).json({ ok: false, error: 'Forbidden' });
    }

    await prisma.demandPost.delete({
      where: { id: req.params.id }
    });

    res.json({ ok: true, message: 'Demand post deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/demands/:id error:', error);
    res.status(500).json({ ok: false, error: 'Failed to delete demand post' });
  }
});

export default router;