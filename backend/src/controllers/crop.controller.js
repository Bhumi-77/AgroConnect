import { prisma } from '../index.js';
import path from 'path';

// ✅ GET All Crops with filters
export const getAllCrops = async (req, res, next) => {
  try {
    const { q, category, district, municipality, minPrice, maxPrice, active, farmerId } = req.query;

    const where = {
      isActive: active === undefined ? true : active === 'true',
      ...(category ? { category: String(category) } : {}),
      ...(farmerId ? { farmerId: String(farmerId) } : {}),
      ...(district ? { district: String(district) } : {}),
      ...(municipality ? { municipality: String(municipality) } : {}),
      ...(minPrice || maxPrice ? { 
        price: { 
          gte: minPrice ? Number(minPrice) : undefined, 
          lte: maxPrice ? Number(maxPrice) : undefined 
        } 
      } : {}),
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
        farmer: { 
          select: { 
            id: true, 
            fullName: true, 
            district: true, 
            municipality: true, 
            phone: true, 
            isVerified: true 
          } 
        },
        inventory: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Add computed stock fields for frontend
    const cropsWithStock = crops.map(c => ({
      ...c,
      availableQty: c.inventory?.available ?? 0,
      inStock: (c.inventory?.available ?? 0) > 0
    }));

    res.json({ ok: true, crops: cropsWithStock });
  } catch (error) {
    next(error);
  }
};

// ✅ GET Farmer's own crops
export const getFarmerCrops = async (req, res, next) => {
  try {
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

    res.json({ ok: true, crops: cropsWithStock });
  } catch (error) {
    next(error);
  }
};

// ✅ GET Single Crop by ID
export const getCropById = async (req, res, next) => {
  try {
    const crop = await prisma.crop.findUnique({
      where: { id: req.params.id },
      include: { 
        farmer: { 
          select: { 
            id: true, 
            fullName: true, 
            district: true, 
            municipality: true, 
            phone: true, 
            isVerified: true 
          } 
        }, 
        inventory: true 
      }
    });

    if (!crop) {
      return res.status(404).json({ ok: false, error: 'Crop not found' });
    }

    // Add computed stock fields for frontend
    const cropWithStock = {
      ...crop,
      availableQty: crop.inventory?.available ?? 0,
      inStock: (crop.inventory?.available ?? 0) > 0
    };

    res.json({ ok: true, crop: cropWithStock });
  } catch (error) {
    next(error);
  }
};

// ✅ CREATE New Crop
export const createCrop = async (req, res, next) => {
  try {
    const files = req.files || [];
    const images = files.map(f => `/uploads/${path.basename(f.path)}`);

    const {
      titleEn, titleNp, category, descriptionEn, descriptionNp,
      qualityGrade, unit, price, quantity,
      district, municipality, latitude, longitude
    } = req.body;

    // Validation
    if (!titleEn || !titleNp || !category || !unit || !price || quantity === undefined) {
      return res.status(400).json({ ok: false, error: 'Missing required fields' });
    }

    const qty = Number(quantity || 0);

    const crop = await prisma.crop.create({
      data: {
        farmerId: req.user.id,
        titleEn, 
        titleNp, 
        category,
        descriptionEn, 
        descriptionNp,
        qualityGrade,
        unit,
        price: Number(price),
        quantity: qty,
        images,
        district, 
        municipality,
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null,
        inventory: { 
          create: { 
            available: qty, 
            reserved: 0, 
            sold: 0 
          } 
        }
      },
      include: { inventory: true }
    });

    // Add computed stock fields for response consistency
    const cropWithStock = {
      ...crop,
      availableQty: crop.inventory?.available ?? 0,
      inStock: (crop.inventory?.available ?? 0) > 0
    };

    res.status(201).json({ ok: true, crop: cropWithStock });
  } catch (error) {
    next(error);
  }
};

// ✅ UPDATE Crop
export const updateCrop = async (req, res, next) => {
  try {
    const crop = await prisma.crop.findUnique({ 
      where: { id: req.params.id }, 
      include: { inventory: true } 
    });

    if (!crop) {
      return res.status(404).json({ ok: false, error: 'Crop not found' });
    }

    if (crop.farmerId !== req.user.id) {
      return res.status(403).json({ ok: false, error: 'Forbidden' });
    }

    const {
      titleEn, titleNp, category, descriptionEn, descriptionNp,
      qualityGrade, unit, price, isActive,
      district, municipality, latitude, longitude,
      quantity
    } = req.body;

    const qty = quantity !== undefined ? Number(quantity) : undefined;

    const updated = await prisma.crop.update({
      where: { id: crop.id },
      data: {
        titleEn, 
        titleNp, 
        category, 
        descriptionEn, 
        descriptionNp,
        qualityGrade, 
        unit,
        price: price !== undefined ? Number(price) : undefined,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined,
        district, 
        municipality,
        latitude: latitude !== undefined ? (latitude === null ? null : Number(latitude)) : undefined,
        longitude: longitude !== undefined ? (longitude === null ? null : Number(longitude)) : undefined,
        quantity: qty !== undefined ? qty : undefined,

        // Keep inventory available synced if farmer updates quantity
        inventory: qty !== undefined
          ? { 
              upsert: { 
                create: { available: qty, reserved: 0, sold: 0 }, 
                update: { available: qty } 
              } 
            }
          : undefined
      },
      include: { inventory: true }
    });

    const updatedWithStock = {
      ...updated,
      availableQty: updated.inventory?.available ?? 0,
      inStock: (updated.inventory?.available ?? 0) > 0
    };

    res.json({ ok: true, crop: updatedWithStock });
  } catch (error) {
    next(error);
  }
};

// ✅ DELETE Crop (Soft Delete)
export const deleteCrop = async (req, res, next) => {
  try {
    const crop = await prisma.crop.findUnique({ 
      where: { id: req.params.id } 
    });

    if (!crop) {
      return res.status(404).json({ ok: false, error: 'Crop not found' });
    }

    if (crop.farmerId !== req.user.id) {
      return res.status(403).json({ ok: false, error: 'Forbidden' });
    }

    // Soft delete instead of hard delete because OrderItem has FK to Crop
    await prisma.crop.update({
      where: { id: crop.id },
      data: { isActive: false }
    });

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
};