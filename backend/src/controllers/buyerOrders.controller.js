import prisma from "../../prisma/prisma.js";


// GET /api/orders/buyer/my
export async function listMyOrders(req, res) {
  try {
    const buyerId = req.user.id;

    const orders = await prisma.order.findMany({
      where: { buyerId },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: { crop: true },
        },
        payment: true,
      },
    });

    return res.json({ ok: true, orders });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, message: "Failed to load orders" });
  }
}

// GET /api/orders/buyer/:id
export async function getMyOrderById(req, res) {
  try {
    const buyerId = req.user.id;
    const id = req.params.id;

    const order = await prisma.order.findFirst({
      where: { id, buyerId },
      include: {
        items: { include: { crop: true } },
        payment: true,
      },
    });

    if (!order) return res.status(404).json({ ok: false, message: "Order not found" });

    return res.json({ ok: true, order });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, message: "Failed to load order" });
  }
}
