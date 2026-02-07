import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@krishi.local';
  const farmerEmail = 'farmer@krishi.local';
  const buyerEmail = 'buyer@krishi.local';

  const passwordHash = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: { fullName: 'Admin', email: adminEmail, passwordHash, role: 'ADMIN', isVerified: true, language: 'en' },
  });

  const farmer = await prisma.user.upsert({
    where: { email: farmerEmail },
    update: {},
    create: { fullName: 'Demo Farmer', email: farmerEmail, passwordHash, role: 'FARMER', isVerified: true, language: 'en', district: 'Kathmandu', municipality: 'KMC', latitude: 27.7172, longitude: 85.3240 },
  });

  const buyer = await prisma.user.upsert({
    where: { email: buyerEmail },
    update: {},
    create: { fullName: 'Demo Buyer', email: buyerEmail, passwordHash, role: 'BUYER', isVerified: true, language: 'en', district: 'Kathmandu', municipality: 'KMC' },
  });

  const crop = await prisma.crop.create({
    data: {
      farmerId: farmer.id,
      titleEn: 'Fresh Tomatoes',
      titleNp: 'ताजा टमाटर',
      category: 'vegetables',
      descriptionEn: 'Farm fresh tomatoes. Same-day harvest.',
      descriptionNp: 'खेतबाट ताजा टमाटर। आजै टिपेको।',
      qualityGrade: 'A',
      unit: 'kg',
      price: 120,
      quantity: 50,
      images: [],
      district: 'Kathmandu',
      municipality: 'KMC',
      latitude: 27.7172,
      longitude: 85.3240,
      inventory: { create: { available: 50, reserved: 0, sold: 0, lowStockThreshold: 5 } }
    }
  });

  await prisma.demandPost.create({
    data: {
      buyerId: buyer.id,
      titleEn: 'Need Potatoes weekly',
      titleNp: 'साप्ताहिक आलु चाहियो',
      category: 'vegetables',
      quantity: 100,
      unit: 'kg',
      district: 'Kathmandu',
      municipality: 'KMC'
    }
  });

  console.log('Seeded:', { adminEmail, farmerEmail, buyerEmail, cropId: crop.id });
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
