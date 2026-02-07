import { Router } from 'express';
import { prisma } from '../index.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// list rooms for current user
router.get('/rooms', requireAuth, async (req, res) => {
  const where = req.user.role === 'BUYER'
    ? { buyerId: req.user.id }
    : req.user.role === 'FARMER'
      ? { farmerId: req.user.id }
      : {};

  const rooms = await prisma.chatRoom.findMany({
    where,
    include: {
      messages: { orderBy: { createdAt: 'desc' }, take: 1 },
    },
    orderBy: { createdAt: 'desc' }
  });

  res.json({ ok:true, rooms });
});

// create/get room by buyer+farmer
router.post('/room', requireAuth, async (req, res) => {
  const { buyerId, farmerId } = req.body;
  if (!buyerId || !farmerId) return res.status(400).json({ ok:false, error:'buyerId and farmerId required' });

  // Only admin OR one of the participants can create
  const isParticipant = req.user.id === buyerId || req.user.id === farmerId || req.user.role === 'ADMIN';
  if (!isParticipant) return res.status(403).json({ ok:false, error:'Forbidden' });

  const room = await prisma.chatRoom.upsert({
    where: { buyerId_farmerId: { buyerId, farmerId } },
    update: {},
    create: { buyerId, farmerId }
  });

  res.json({ ok:true, room });
});

// messages for room
router.get('/room/:roomId/messages', requireAuth, async (req, res) => {
  const roomId = req.params.roomId;
  const room = await prisma.chatRoom.findUnique({ where: { id: roomId } });
  if (!room) return res.status(404).json({ ok:false, error:'Room not found' });

  const isParticipant = req.user.role === 'ADMIN' || req.user.id === room.buyerId || req.user.id === room.farmerId;
  if (!isParticipant) return res.status(403).json({ ok:false, error:'Forbidden' });

  const messages = await prisma.message.findMany({
    where: { roomId },
    include: { sender: { select: { id:true, fullName:true, role:true } } },
    orderBy: { createdAt: 'asc' }
  });

  res.json({ ok:true, room, messages });
});

export default router;
