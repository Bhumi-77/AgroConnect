import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { requireAuth, requireRole } from '../middleware/auth.js';

// ✅ Import controller functions
import { 
  getAllCrops, 
  getFarmerCrops, 
  getCropById, 
  createCrop, 
  updateCrop, 
  deleteCrop 
} from '../controllers/crop.controller.js';

const router = Router();

/* =====================================================
   Multer Configuration (Image Upload Setup)
===================================================== */

const uploadDir = path.join(process.cwd(), 'uploads');

// Ensure uploads folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/\s+/g, '_');
    cb(null, `${Date.now()}-${cleanName}`);
  }
});

// Exported in case controller needs access
export const upload = multer({ storage });

/* =====================================================
   Routes
===================================================== */

/**
 * GET all crops with filters
 * Public access
 */
router.get('/', getAllCrops);


/**
 * ✅ IMPORTANT:
 * Must come BEFORE "/:id"
 * Otherwise Express treats "farmer" as an ID
 */
router.get(
  '/farmer/mine/list',
  requireAuth,
  requireRole('FARMER'),
  getFarmerCrops
);


/**
 * GET single crop by ID
 * Public
 */
router.get('/:id', getCropById);


/**
 * CREATE crop
 * Farmer only
 * Supports image upload
 */
router.post(
  '/',
  requireAuth,
  requireRole('FARMER'),
  upload.array('images', 5),
  createCrop
);


/**
 * UPDATE crop
 * Farmer only
 */
router.put(
  '/:id',
  requireAuth,
  requireRole('FARMER'),
  updateCrop
);


/**
 * DELETE crop (Soft delete)
 * Farmer only
 */
router.delete(
  '/:id',
  requireAuth,
  requireRole('FARMER'),
  deleteCrop
);

export default router;