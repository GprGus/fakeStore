import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import { system, database, requestLogger } from './utils/logger.js';
import authRoutes     from './routes/auth.js';
import userRoutes     from './routes/user.js';
import orderRoutes    from './routes/orders.js';
import productRoutes  from './routes/products.js';
import reviewRoutes   from './routes/reviews.js';
import categoryRoutes from './routes/categories.js';
import adminRoutes    from './routes/admin.js';
import User from './models/User.js';

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

// ─── Fallback ───
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

// ─── Seed admin user on first boot ───
async function seedAdmin() {
  const adminUser  = process.env.ADMIN_USER  || 'admin';
  const adminPass  = process.env.ADMIN_PASS  || 'admin123';
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@minishop.com';

  const exists = await User.findOne({ role: 'admin' });
  if (!exists) {
    await User.create({
      username: adminUser,
      email: adminEmail,
      password: adminPass,
      name: { firstname: 'Admin', lastname: '' },
      role: 'admin',
    });
    system.info(`Admin master criado: ${adminUser} / ${adminPass}`);
  }
}

// ─── Connect to MongoDB & Start ───
async function start() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    system.error('MONGO_URI não configurado no .env');
    process.exit(1);
  }

  mongoose.set('debug', (collection, method, query) => {
    database.debug(`${collection}.${method}`, {
      query: JSON.parse(JSON.stringify(query || {})),
    });
  });

  try {
    await mongoose.connect(uri);
    database.info('MongoDB Atlas conectado com sucesso');
    await seedAdmin();
  } catch (err) {
    database.error(`Falha ao conectar MongoDB: ${err.message}`);
    process.exit(1);
  }

  app.listen(PORT, () => {
    system.info(`MiniShop v2 rodando em http://localhost:${PORT}`);
    system.info(`Admin panel: http://localhost:${PORT}/admin`);
    system.info(`WhatsApp Phone ID: ${process.env.WA_PHONE_ID || 'não configurado'}`);
    if (!process.env.WA_TOKEN) system.warn('WA_TOKEN não configurado');
  });
}

start();
