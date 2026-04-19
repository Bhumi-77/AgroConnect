import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'agroconnect/crops',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

export const upload = multer({ storage });