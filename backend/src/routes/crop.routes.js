import { Router } from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { 
  getAllCrops, 
  getFarmerCrops, 
  getCropById, 
  createCrop, 
  updateCrop, 
  deleteCrop 
} from '../controllers/crop.controller.js';

const router = Router();

// ✅ Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Cloudinary storage instead of local disk
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'agroconnect/crops',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

export const upload = multer({ storage });

// Routes
router.get('/', getAllCrops);

router.get(
  '/farmer/mine/list',
  requireAuth,
  requireRole('FARMER'),
  getFarmerCrops
);

router.get('/:id', getCropById);

router.post(
  '/',
  requireAuth,
  requireRole('FARMER'),
  upload.array('images', 5),
  createCrop
);

router.put(
  '/:id',
  requireAuth,
  requireRole('FARMER'),
  updateCrop
);

router.delete(
  '/:id',
  requireAuth,
  requireRole('FARMER'),
  deleteCrop
);

export default router;