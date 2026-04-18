
import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../index.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// console.log(' auth.routes.js loaded');

const router = Router();

// console.log(' router created');

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

// ─── Forgot Password ───────────────────────────────────────────────────────────
router.post('/forgot-password',
  body('email').isEmail(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ ok:false, errors: errors.array() });

    const { email } = req.body;
    try {
      const user = await prisma.user.findUnique({ where: { email } });

      // Always return ok:true for security (don't reveal if email exists)
      if (!user) return res.json({ ok: true });

      const token = crypto.randomBytes(32).toString('hex');
      const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await prisma.user.update({
        where: { email },
        data: { resetToken: token, resetTokenExpiry: expiry }
      });

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      await transporter.sendMail({
        from: `"Krishi Connect" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Reset your Krishi Connect password',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
            <h2 style="color: #4a7c3b;">🌾 Krishi Connect</h2>
            <p>You requested a password reset. Click the button below to set a new password.</p>
            <p>This link expires in <strong>1 hour</strong>.</p>
            <a href="${process.env.FRONTEND_URL}/reset-password?token=${token}"
               style="display:inline-block; padding:12px 24px; background:#4a7c3b;
                      color:white; border-radius:8px; text-decoration:none; font-weight:bold;">
              Reset Password
            </a>
            <p style="color:#999; font-size:12px; margin-top:20px;">
              If you didn't request this, you can safely ignore this email.
            </p>
          </div>
        `
      });

      res.json({ ok: true });
    } catch (err) {
      console.error('Forgot password error:', err);
      res.status(500).json({ ok: false, error: 'Server error' });
    }
  }
);

// ─── Reset Password ────────────────────────────────────────────────────────────
router.post('/reset-password',
  body('token').notEmpty(),
  body('newPassword').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ ok:false, errors: errors.array() });

    const { token, newPassword } = req.body;
    try {
      const user = await prisma.user.findFirst({
        where: {
          resetToken: token,
          resetTokenExpiry: { gt: new Date() }
        }
      });

      if (!user) return res.status(400).json({ ok: false, error: 'Invalid or expired reset link' });

      const passwordHash = await hashPassword(newPassword);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordHash,
          resetToken: null,
          resetTokenExpiry: null
        }
      });

      res.json({ ok: true });
    } catch (err) {
      console.error('Reset password error:', err);
      res.status(500).json({ ok: false, error: err.message });
    }
  }
);

export default router;