import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../index.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';

const router = Router();

router.post('/register',
  body('fullName').isLength({ min: 2 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['FARMER','BUYER']),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ ok:false, errors: errors.array() });

    const { fullName, email, password, role, phone, district, municipality, ward, language, latitude, longitude, address } = req.body;

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ ok:false, error:'Email already used' });

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { fullName, email, passwordHash, role, phone, district, municipality, ward, language: language || 'en', latitude, longitude, address }
    });

    const token = signToken(user);
    res.json({ ok:true, token, user: { id:user.id, fullName:user.fullName, email:user.email, role:user.role, language:user.language, isVerified:user.isVerified } });
  }
);

router.post('/login',
  body('email').isEmail(),
  body('password').isLength({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ ok:false, errors: errors.array() });

    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ ok:false, error:'Invalid credentials' });

    const ok = await comparePassword(password, user.passwordHash);
    if (!ok) return res.status(401).json({ ok:false, error:'Invalid credentials' });

    const token = signToken(user);
    res.json({ ok:true, token, user: { id:user.id, fullName:user.fullName, email:user.email, role:user.role, language:user.language, isVerified:user.isVerified } });
  }
);

export default router;
