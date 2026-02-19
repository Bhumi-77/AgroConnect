import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { prisma } from '../index.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g,'_')}`)
});
const upload = multer({ storage });

router.get('/', async (req, res) => {
  const { q, category, district, municipality, minPrice, maxPrice, active, farmerId } = req.query;

  const where = {
    isActive: active === undefined ? true : active === 'true',
    ...(category ? { category: String(category) } : {}),
    ...(farmerId ? { farmerId: String(farmerId) } : {}),
    ...(district ? { district: String(district) } : {}),
    ...(municipality ? { municipality: String(municipality) } : {}),
    ...(minPrice || maxPrice ? { price: { gte: minPrice ? Number(minPrice) : undefined, lte: maxPrice ? Number(maxPrice) : undefined } } : {}),
    ...(q ? {
      OR: [
        { titleEn: { contains: String(q), mode: 'insensitive' } },
        { titleNp: { contains: String(q), mode: 'insensitive' } },
        { descriptionEn: { contains: String(q), mode: 'insensitive' } },
        { descriptionNp: { contains: String(q), mode: 'insensitive' } }
      ]
    } : {})
  };

  const crops = await prisma.crop.findMany({
    where,
    include: {
      farmer: { select: { id:true, fullName:true, district:true, municipality:true, phone:true, isVerified:true } },
      inventory: true
    },
    orderBy: { createdAt: 'desc' }
  });

  // ✅ add computed stock fields for frontend
  const cropsWithStock = crops.map(c => ({
    ...c,
    availableQty: c.inventory?.available ?? 0,
    inStock: (c.inventory?.available ?? 0) > 0
  }));

  res.json({ ok:true, crops: cropsWithStock });
});

router.get('/:id', async (req, res) => {
  const crop = await prisma.crop.findUnique({
    where: { id: req.params.id },
    include: { farmer: { select: { id:true, fullName:true, district:true, municipality:true, phone:true, isVerified:true } }, inventory: true }
  });
  if (!crop) return res.status(404).json({ ok:false, error:'Crop not found' });

  // ✅ add computed stock fields for frontend
  const cropWithStock = {
    ...crop,
    availableQty: crop.inventory?.available ?? 0,
    inStock: (crop.inventory?.available ?? 0) > 0
  };

  res.json({ ok:true, crop: cropWithStock });
});

router.post('/',
  requireAuth, requireRole('FARMER'),
  upload.array('images', 5),
  async (req, res) => {
    const files = req.files || [];
    const images = files.map(f => `/uploads/${path.basename(f.path)}`);

    const {
      titleEn, titleNp, category, descriptionEn, descriptionNp,
      qualityGrade, unit, price, quantity,
      district, municipality, latitude, longitude
    } = req.body;

    const qty = Number(quantity || 0);

    const crop = await prisma.crop.create({
      data: {
        farmerId: req.user.id,
        titleEn, titleNp, category,
        descriptionEn, descriptionNp,
        qualityGrade,
        unit,
        price: Number(price),
        quantity: qty,
        images,
        district, municipality,
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null,
        inventory: { create: { available: qty, reserved: 0, sold: 0 } }
      },
      include: { inventory: true }
    });

    // ✅ add computed stock fields for response consistency
    const cropWithStock = {
      ...crop,
      availableQty: crop.inventory?.available ?? 0,
      inStock: (crop.inventory?.available ?? 0) > 0
    };

    res.json({ ok:true, crop: cropWithStock });
  }
);

router.put('/:id', requireAuth, requireRole('FARMER'), async (req, res) => {
  const crop = await prisma.crop.findUnique({ where: { id: req.params.id }, include: { inventory: true } });
  if (!crop) return res.status(404).json({ ok:false, error:'Not found' });
  if (crop.farmerId !== req.user.id) return res.status(403).json({ ok:false, error:'Forbidden' });

  const {
    titleEn, titleNp, category, descriptionEn, descriptionNp,
    qualityGrade, unit, price, isActive,
    district, municipality, latitude, longitude,
    quantity // ✅ allow updating quantity -> also update inventory.available
  } = req.body;

  const qty = quantity !== undefined ? Number(quantity) : undefined;

  const updated = await prisma.crop.update({
    where: { id: crop.id },
    data: {
      titleEn, titleNp, category, descriptionEn, descriptionNp,
      qualityGrade, unit,
      price: price !== undefined ? Number(price) : undefined,
      isActive: isActive !== undefined ? Boolean(isActive) : undefined,
      district, municipality,
      latitude: latitude !== undefined ? (latitude === null ? null : Number(latitude)) : undefined,
      longitude: longitude !== undefined ? (longitude === null ? null : Number(longitude)) : undefined,
      quantity: qty !== undefined ? qty : undefined,

      // ✅ keep inventory available synced if farmer updates quantity
      inventory: qty !== undefined
        ? { upsert: { create: { available: qty, reserved: 0, sold: 0 }, update: { available: qty } } }
        : undefined
    },
    include: { inventory: true }
  });

  const updatedWithStock = {
    ...updated,
    availableQty: updated.inventory?.available ?? 0,
    inStock: (updated.inventory?.available ?? 0) > 0
  };

  res.json({ ok:true, crop: updatedWithStock });
});

router.delete('/:id', requireAuth, requireRole('FARMER'), async (req, res) => {
  const crop = await prisma.crop.findUnique({ where: { id: req.params.id } });
  if (!crop) return res.status(404).json({ ok:false, error:'Not found' });
  if (crop.farmerId !== req.user.id) return res.status(403).json({ ok:false, error:'Forbidden' });

  await prisma.crop.delete({ where: { id: crop.id } });
  res.json({ ok:true });
});

router.get('/farmer/mine/list', requireAuth, requireRole('FARMER'), async (req, res) => {
  const crops = await prisma.crop.findMany({
    where: { farmerId: req.user.id },
    include: { inventory: true },
    orderBy: { createdAt: 'desc' }
  });

  const cropsWithStock = crops.map(c => ({
    ...c,
    availableQty: c.inventory?.available ?? 0,
    inStock: (c.inventory?.available ?? 0) > 0
  }));

  res.json({ ok:true, crops: cropsWithStock });
});

export default router;
