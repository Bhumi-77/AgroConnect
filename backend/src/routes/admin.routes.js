import { Router } from 'express';
import { prisma } from '../index.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

/* =========================
   TEST ROUTE
========================= */
router.get('/test', (req, res) => {
  res.json({
    ok: true,
    message: 'ADMIN ROUTES FILE IS ACTIVE'
  });
});

/* =========================
   DASHBOARD
========================= */
router.get('/dashboard', requireAuth, requireRole('ADMIN'), async (req, res) => {
  try {
    const [users, crops, orders, pending] = await Promise.all([
      prisma.user.count(),
      prisma.crop.count(),
      prisma.order.count(),
      prisma.user.count({ where: { isVerified: false } })
    ]);

    res.json({
      ok: true,
      stats: {
        users,
        crops,
        orders,
        unverifiedUsers: pending
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to load dashboard stats'
    });
  }
});

/* =========================
   REPORTS
========================= */
router.get('/reports', requireAuth, requireRole('ADMIN'), async (req, res) => {
  try {
    // basic counts
    const totalUsers = await prisma.user.count();
    const totalFarmers = await prisma.user.count({ where: { role: 'FARMER' } });
    const totalBuyers = await prisma.user.count({ where: { role: 'BUYER' } });

    const totalOrders = await prisma.order.count();
    const pendingOrders = await prisma.order.count({ where: { status: 'PENDING' } });

    const totalCrops = await prisma.crop.count();
    const activeCrops = await prisma.crop.count({ where: { isActive: true } });

    // revenue (safe)
    let totalRevenue = 0;
    try {
      const payments = await prisma.payment.findMany({
        where: { status: 'success' }
      });
      totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    } catch (e) {
      console.log("⚠️ Payment or amount missing");
    }

    // sales by status
    let salesByStatus = {};
    try {
      const statuses = ['PENDING', 'CONFIRMED', 'DELIVERED', 'PAID', 'CANCELLED'];
      for (let s of statuses) {
        const count = await prisma.order.count({ where: { status: s } });
        salesByStatus[s] = count;
      }
    } catch (e) {
      console.log("⚠️ Order status issue");
    }

    // top crops (basic safe version)
    let topCrops = [];
    try {
      const crops = await prisma.crop.findMany({
        take: 6
      });

      topCrops = crops.map(c => ({
        id: c.id,
        name: c.name || c.titleEn,
        totalSold: 0 // (you can improve later)
      }));
    } catch (e) {
      console.log("⚠️ Crop issue");
    }

    // recent activity (simple)
    let recentActivity = [];
    try {
      const recentOrders = await prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
      });

      recentActivity = recentOrders.map(o => ({
        type: 'ORDER',
        message: `Order ${o.id} placed`,
        createdAt: o.createdAt
      }));
    } catch (e) {
      console.log("⚠️ Activity issue");
    }

    res.json({
      ok: true,
      report: {
        totalUsers,
        totalFarmers,
        totalBuyers,
        totalOrders,
        pendingOrders,
        totalRevenue,
        activeCrops,
        totalCrops,
        salesByStatus,
        topCrops,
        recentActivity
      }
    });

  } catch (error) {
    console.error('❌ Admin reports error:', error);
    res.status(500).json({
      ok: false,
      error: error.message //  IMPORTANT for debugging
    });
  }
});

/* =========================
   USERS
========================= */
router.get('/users', requireAuth, requireRole('ADMIN'), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        isVerified: true,
        // status: true, //  FIXED (important)
        district: true,
        municipality: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedUsers = users.map((user) => ({
      ...user,
      status: user.status || 'ACTIVE', // ✅ fallback
      verificationStatus: user.isVerified ? 'Verified' : 'Pending'
    }));

    console.log('✅ Admin users fetched:', formattedUsers.length);

    res.json({
      ok: true,
      users: formattedUsers
    });

  } catch (error) {
    console.error('❌ Admin users fetch error:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to fetch users'
    });
  }
});

/* =========================
   VERIFY / UNVERIFY USER
========================= */
router.patch('/users/:id/verify', requireAuth, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const { verified } = req.body;

    if (typeof verified !== 'boolean') {
      return res.status(400).json({
        ok: false,
        error: 'verified must be true or false'
      });
    }

    const existingUser = await prisma.user.findUnique({ where: { id } });

    if (!existingUser) {
      return res.status(404).json({
        ok: false,
        error: 'User not found'
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isVerified: verified }
    });

    res.json({
      ok: true,
      message: `User ${verified ? 'verified' : 'unverified'} successfully`,
      user: updatedUser
    });

  } catch (error) {
    console.error('❌ Verify user error:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to update verification status'
    });
  }
});

/* =========================
   USER STATUS
========================= */
router.patch('/users/:id/status', requireAuth, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['ACTIVE', 'SUSPENDED'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        ok: false,
        error: 'Invalid status value'
      });
    }

    const existingUser = await prisma.user.findUnique({ where: { id } });

    if (!existingUser) {
      return res.status(404).json({
        ok: false,
        error: 'User not found'
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { status }
    });

    res.json({
      ok: true,
      message: `User status updated to ${status}`,
      user: updatedUser
    });

  } catch (error) {
    console.error('❌ User status error:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to update user status'
    });
  }
});

/* =========================
   CROPS
========================= */
router.post('/crops/:id/toggle', requireAuth, requireRole('ADMIN'), async (req, res) => {
  try {
    const crop = await prisma.crop.findUnique({ where: { id: req.params.id } });

    if (!crop) {
      return res.status(404).json({
        ok: false,
        error: 'Crop not found'
      });
    }

    const updated = await prisma.crop.update({
      where: { id: crop.id },
      data: { isActive: !crop.isActive }
    });

    res.json({ ok: true, crop: updated });

  } catch (error) {
    console.error('❌ Crop toggle error:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to update crop status'
    });
  }
});

/* =========================
   ORDERS
========================= */
router.get('/orders', requireAuth, requireRole('ADMIN'), async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            crop: {
              include: {
                farmer: {
                  select: { id: true, fullName: true, email: true }
                }
              }
            }
          }
        },
        buyer: {
          select: { id: true, fullName: true, email: true }
        },
        payment: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ ok: true, orders });

  } catch (error) {
    console.error('❌ Orders fetch error:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to fetch orders'
    });
  }
});

/* =========================
   UPDATE ORDER STATUS
========================= */
router.patch('/orders/:orderId/status', requireAuth, requireRole('ADMIN'), async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['PENDING', 'CONFIRMED', 'DELIVERED', 'PAID', 'CANCELLED'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        ok: false,
        error: 'Invalid status value'
      });
    }

    const existingOrder = await prisma.order.findUnique({ where: { id: orderId } });

    if (!existingOrder) {
      return res.status(404).json({
        ok: false,
        error: 'Order not found'
      });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });

    // sync payment status
    if (status === 'PAID' || status === 'DELIVERED') {
      await prisma.payment.updateMany({
        where: { orderId },
        data: { status: 'success' }
      });
    }

    if (status === 'CANCELLED') {
      await prisma.payment.updateMany({
        where: { orderId },
        data: { status: 'failed' }
      });
    }

    res.json({
      ok: true,
      message: `Order updated to ${status}`,
      order: updatedOrder
    });

  } catch (error) {
    console.error('❌ Order status error:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to update order status'
    });
  }
});

/* =========================
   ✅ NEW: PAYMENTS (FIXED 404)
========================= */
router.get('/payments', requireAuth, requireRole('ADMIN'), async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        order: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      ok: true,
      payments
    });

  } catch (error) {
    console.error('❌ Payments fetch error:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to fetch payments'
    });
  }
});

export default router;