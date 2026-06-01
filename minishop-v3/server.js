import 'dotenv/config';
import express from 'express';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import { system, database, requestLogger } from './utils/logger.js';
import prisma from './lib/db.js';

import authRoutes     from './routes/auth.js';
import userRoutes     from './routes/user.js';
import orderRoutes    from './routes/orders.js';
import productRoutes  from './routes/products.js';
import reviewRoutes   from './routes/reviews.js';
import categoryRoutes from './routes/categories.js';
import adminRoutes    from './routes/admin.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───
app.use(express.json({ limit: '5mb' }));
app.use(requestLogger);
app.use(express.static(join(__dirname, 'public')));

// ─── API Routes ───
app.use('/api/auth',       authRoutes);
app.use('/api/user',       userRoutes);
app.use('/api/orders',     orderRoutes);
app.use('/api/products',   productRoutes);
app.use('/api/reviews',    reviewRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin',      adminRoutes);

// ─── Admin page ───
app.get('/admin', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'admin.html'));
});

// ─── Fallback SPA ───
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

// ─── Seed admin user on first boot ───
async function seedAdmin() {
  const adminUser  = process.env.ADMIN_USER  || 'admin';
  const adminPass  = process.env.ADMIN_PASS  || 'admin123';
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@minishop.com';

  const exists = await prisma.user.findFirst({ where: { role: 'admin' } });
  if (!exists) {
    const hashed = await bcrypt.hash(adminPass, 10);
    await prisma.user.create({
      data: {
        username: adminUser,
        email: adminEmail,
        password: hashed,
        firstname: 'Admin',
        role: 'admin',
      },
    });
    system.info(`Admin master criado: ${adminUser} / ${adminPass}`);
  }
}

// ─── Connect to PostgreSQL & Start ───
async function start() {
  if (!process.env.DATABASE_URL) {
    system.error('DATABASE_URL não configurado no .env');
    process.exit(1);
  }

  try {
    await prisma.$connect();
    database.info('PostgreSQL conectado com sucesso');
    await seedAdmin();
  } catch (err) {
    database.error(`Falha ao conectar PostgreSQL: ${err.message}`);
    process.exit(1);
  }

  app.listen(PORT, () => {
    system.info(`MiniShop v3 rodando em http://localhost:${PORT}`);
    system.info(`Admin panel: http://localhost:${PORT}/admin`);
    system.info(`WhatsApp Phone ID: ${process.env.WA_PHONE_ID || 'não configurado'}`);
    if (!process.env.WA_TOKEN) system.warn('WA_TOKEN não configurado');
  });
}

start();
