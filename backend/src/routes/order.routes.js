import { Router } from 'express';
import { prisma } from '../index.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// Create order (buyer)
router.post('/', requireAuth, requireRole('BUYER'), async (req, res) => {
  const { items, paymentMethod, deliveryAddress, district, municipality } = req.body;
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ ok:false, error:'No items' });
  if (!['COD','ESEWA'].includes(paymentMethod)) return res.status(400).json({ ok:false, error:'Invalid payment method' });

  // compute totals + reserve inventory transactionally
  const result = await prisma.$transaction(async (tx) => {
    let total = 0;

    // fetch crops
    const cropIds = items.map(i => i.cropId);
    const crops = await tx.crop.findMany({ where: { id: { in: cropIds }, isActive: true }, include: { inventory: true } });
    const map = new Map(crops.map(c => [c.id, c]));

    for (const it of items) {
      const crop = map.get(it.cropId);
      if (!crop) throw new Error('Crop not found or inactive');
      const qty = Number(it.quantity || 0);
      if (qty <= 0) throw new Error('Invalid quantity');
      if (!crop.inventory || crop.inventory.available < qty) throw new Error('Insufficient stock');
      total += qty * crop.price;
    }

    const order = await tx.order.create({
      data: {
        buyerId: req.user.id,
        paymentMethod,
        totalAmount: total,
        deliveryAddress,
        district, municipality,
        items: {
          create: items.map((it) => ({
            cropId: it.cropId,
            quantity: Number(it.quantity),
            unitPrice: map.get(it.cropId).price,
          }))
        },
        payment: {
          create: { method: paymentMethod, status: paymentMethod === 'COD' ? 'pending' : 'initiated' }
        }
      },
      include: { items: true, payment: true }
    });

    // reserve inventory
    for (const it of items) {
      const qty = Number(it.quantity);
      const inv = map.get(it.cropId).inventory;
      await tx.inventory.update({
        where: { id: inv.id },
        data: { available: { decrement: qty }, reserved: { increment: qty } }
      });
    }

    return order;
  });

  res.json({ ok:true, order: result });
});

// Mark payment success (demo endpoint) - for eSewa callback simulation
router.post('/:id/payment/success', requireAuth, async (req, res) => {
  const orderId = req.params.id;

  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { payment: true, items: true } });
  if (!order) return res.status(404).json({ ok:false, error:'Order not found' });

  // Only buyer or admin
  if (req.user.role !== 'ADMIN' && req.user.id !== order.buyerId) return res.status(403).json({ ok:false, error:'Forbidden' });

  const updated = await prisma.$transaction(async (tx) => {
    await tx.payment.update({ where: { orderId }, data: { status: 'success', ref: req.body?.ref || 'DEMO_REF' } });
    const ord = await tx.order.update({ where: { id: orderId }, data: { status: 'PAID' }, include: { items: true } });

    // move reserved->sold
    for (const it of ord.items) {
      await tx.inventory.update({
        where: { cropId: it.cropId },
        data: { reserved: { decrement: it.quantity }, sold: { increment: it.quantity } }
      });
    }
    return ord;
  });

  res.json({ ok:true, order: updated });
});

// Buyer orders
router.get('/mine', requireAuth, requireRole('BUYER'), async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { buyerId: req.user.id },
    include: { items: { include: { crop: true } }, payment: true },
    orderBy: { createdAt: 'desc' }
  });
  res.json({ ok:true, orders });
});

// Farmer sales (orders that include farmer's crops)
router.get('/farmer/sales', requireAuth, requireRole('FARMER'), async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { items: { some: { crop: { farmerId: req.user.id } } } },
    include: {
      items: { include: { crop: true } },
      buyer: { select: { id:true, fullName:true, phone:true, email:true } },
      payment: true
    },
    orderBy: { createdAt: 'desc' }
  });
  res.json({ ok:true, orders });
});

// ✅ Farmer updates order status (this was missing)
// PATCH /api/orders/:id/status  body: { status: "CONFIRMED" | "DELIVERED" | "CANCELLED" }
router.patch('/:id/status', requireAuth, requireRole('FARMER'), async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body || {};

  const allowed = ['PENDING', 'CONFIRMED', 'DELIVERED', 'CANCELLED'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ ok: false, error: 'Invalid status' });
  }

  // load order + items + crop farmerId so we can authorize this farmer
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { crop: { select: { id: true, farmerId: true } } } } }
  });
  if (!order) return res.status(404).json({ ok:false, error:'Order not found' });

  // authorize: only farmer who owns at least one crop in this order can update it
  const ownsAny = order.items.some(it => it.crop?.farmerId === req.user.id);
  if (!ownsAny) return res.status(403).json({ ok:false, error:'Forbidden' });

  // (optional) prevent changing after delivered/cancelled
  if (order.status === 'DELIVERED' || order.status === 'CANCELLED') {
    return res.status(400).json({ ok:false, error:`Cannot change status after ${order.status}` });
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: {
      items: { include: { crop: true } },
      buyer: { select: { id:true, fullName:true, phone:true, email:true } },
      payment: true
    }
  });

  res.json({ ok:true, order: updated });
});

export default router;
