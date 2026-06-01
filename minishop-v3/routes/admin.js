import { Router } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../lib/db.js';
import { formatUser, formatProduct } from '../lib/format.js';
import { system, database } from '../utils/logger.js';

const router = Router();

// ─── POST /api/admin/login ───
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    system.info(`Admin login solicitado: ${username}`);
    if (!username || !password) return res.status(400).json({ error: 'Username and password are required' });

    const user = await prisma.user.findFirst({ where: { username: username.toLowerCase(), role: 'admin' } });
    if (!user) { system.warn(`Admin login falhou: "${username}"`); return res.status(401).json({ error: 'Invalid admin credentials' }); }

    const match = await bcrypt.compare(password, user.password);
    if (!match) { system.warn(`Admin senha incorreta: "${username}"`); return res.status(401).json({ error: 'Invalid admin credentials' }); }

    database.info(`Admin login: ${user.username}`);
    res.json({ admin: formatUser(user) });
  } catch (err) {
    system.error(`Erro admin login: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── GET /api/admin/dashboard ───
router.get('/dashboard', async (req, res) => {
  try {
    const [totalUsers, totalOrders, revenueAgg, totalProducts] = await Promise.all([
      prisma.user.count({ where: { role: 'user' } }),
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.product.count({ where: { active: true } }),
    ]);
    const totalRevenue = revenueAgg._sum.total || 0;

    // Top 3 compradores
    const topBuyersRaw = await prisma.order.groupBy({
      by: ['userId'],
      _sum: { total: true },
      _count: { id: true },
      orderBy: { _sum: { total: 'desc' } },
      take: 3,
    });
    const buyerUsers = await prisma.user.findMany({ where: { id: { in: topBuyersRaw.map(b => b.userId) } } });
    const userMap = Object.fromEntries(buyerUsers.map(u => [u.id, u]));
    const topBuyers = topBuyersRaw.map(b => ({
      username:   userMap[b.userId]?.username  || '',
      firstname:  userMap[b.userId]?.firstname || '',
      lastname:   userMap[b.userId]?.lastname  || '',
      email:      userMap[b.userId]?.email     || '',
      totalSpent: b._sum.total,
      orderCount: b._count.id,
    }));

    // 5 produtos mais vendidos (raw SQL para multiplicação price * quantity)
    const bestSellingRaw = await prisma.$queryRaw`
      SELECT title, image,
             CAST(SUM(quantity) AS INTEGER)        AS "totalQty",
             CAST(SUM(price * quantity) AS FLOAT)  AS "totalRevenue"
      FROM "OrderItem"
      GROUP BY title, image
      ORDER BY "totalQty" DESC
      LIMIT 5
    `;
    const bestSelling = bestSellingRaw.map(r => ({
      title:        r.title,
      image:        r.image,
      totalQty:     Number(r.totalQty),
      totalRevenue: Number(r.totalRevenue),
    }));

    // 10 pedidos recentes
    const recentOrdersRaw = await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user:  { select: { id: true, username: true, firstname: true, lastname: true, email: true } },
        items: true,
      },
    });
    const recentOrders = recentOrdersRaw.map(o => ({
      ...o,
      _id: o.id,
      userId: o.user ? {
        _id: o.user.id,
        username: o.user.username,
        name: { firstname: o.user.firstname, lastname: o.user.lastname },
        email: o.user.email,
      } : null,
    }));

    database.info('Dashboard admin consultado');
    res.json({ stats: { totalUsers, totalOrders, totalRevenue, totalProducts }, topBuyers, bestSelling, recentOrders });
  } catch (err) {
    database.error(`Erro dashboard: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── GET /api/admin/products ─── (inclui inativos)
router.get('/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    });

    const enriched = await Promise.all(products.map(async (p) => {
      const { _avg, _count } = await prisma.review.aggregate({
        where: { productId: p.id },
        _avg: { rating: true },
        _count: { id: true },
      });
      return {
        ...formatProduct(p),
        categoryName: p.category?.name || 'uncategorized',
        rating: { rate: Math.round((_avg.rating || 0) * 10) / 10, count: _count.id },
      };
    }));

    res.json({ products: enriched });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
