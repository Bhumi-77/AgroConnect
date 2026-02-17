# Krishi Connect (MERN + Prisma + PostgreSQL)

This project is generated from your proposal + interim report for **Krishi Connect / Agro Connect**: a MERN marketplace connecting **Farmers**, **Buyers**, and **Admins**, with crop listing, inventory, chat, location filtering, bilingual UI, and payment (COD + demo eSewa flow).

## Tech
- Frontend: React (Vite), React Router, Axios, i18next, Socket.IO client
- Backend: Node/Express, Prisma, PostgreSQL, Socket.IO
- DB viewer: `npx prisma studio`

---

## 1) Setup Database
Create a PostgreSQL DB (example: `krishiconnect`).

Copy env:
- `backend/.env.example` → `backend/.env`
- Update `DATABASE_URL` and `JWT_SECRET`

---

## 2) Backend (API)
```bash
cd backend
npm i
npx prisma migrate dev
node prisma/seed.js
npm run dev
```

API: `http://localhost:4000`

Open Prisma Studio:
```bash
npx prisma studio
```

Seeded demo accounts:
- Admin: `admin@krishi.local` / `password123`
- Farmer: `farmer@krishi.local` / `password123`
- Buyer: `buyer@krishi.local` / `password123`

---

## 3) Frontend
```bash
cd ../frontend
npm i
npm run dev
```

Frontend: `http://localhost:5173`

---

## 4) ml-service
cd ml-service
python -m venv .venv
python -m pip install -r requirements.txt

python -m uvicorn app:app --host 127.0.0.1 --port 8000
ML_URL=http://127.0.0.1:8000

files ignored by git 


## 5) Demo Features Map
- Role-based Login/Register (Farmer, Buyer) + Admin login (seeded)
- Farmer:
  - Dashboard: crops + inventory status
  - Add crop (images upload)
  - Sales (orders containing their crops)
- Buyer:
  - Marketplace: search, category filter, location filter
  - Product details
  - Create order (COD or ESEWA-demo)
  - Demand board (basic)
- Admin:
  - Dashboard stats
  - Verify users
  - Toggle crop listing active/inactive
  - View orders
- Chat:
  - Buyer ↔ Farmer chat using Socket.IO

> **Note on payment:** This is a **demo eSewa flow** (simulated success endpoint). Replace with real gateway callbacks in production.

---

## Folder Structure
```
krishi-connect/
  backend/
  frontend/
  ml-service
```
