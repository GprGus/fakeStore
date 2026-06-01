import { Router } from 'express';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Review from '../models/Review.js';
import { system, database } from '../utils/logger.js';

const router = Router();

// ─── POST /api/admin/login ───
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    system.info(`Admin login solicitado: ${username}`);
    if (!username || !password) return res.status(400).json({ error: 'Username and password are required' });

    const user = await User.findOne({ username: username.toLowerCase(), role: 'admin' });
    if (!user) { system.warn(`Admin login falhou: "${username}"`); return res.status(401).json({ error: 'Invalid admin credentials' }); }

    const match = await user.comparePassword(password);
    if (!match) { system.warn(`Admin senha incorreta: "${username}"`); return res.status(401).json({ error: 'Invalid admin credentials' }); }

    database.info(`Admin login: ${user.username}`);
    res.json({ admin: user.toPublic() });
  } catch (err) {
    system.error(`Erro admin login: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── GET /api/admin/dashboard ───
router.get('/dashboard', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalOrders = await Order.countDocuments();
    const revenueResult = await Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]);
    const totalRevenue = revenueResult[0]?.total || 0;
    const totalProducts = await Product.countDocuments({ active: true });

    const topBuyers = await Order.aggregate([
      { $group: { _id: '$userId', totalSpent: { $sum: '$total' }, orderCount: { $sum: 1 } } },
      { $sort: { totalSpent: -1 } }, { $limit: 3 },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { _id: 0, username: '$user.username', firstname: '$user.name.firstname', lastname: '$user.name.lastname', email: '$user.email', totalSpent: 1, orderCount: 1 } }
    ]);

    const bestSelling = await Order.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$items.title', totalQty: { $sum: '$items.quantity' }, totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }, image: { $first: '$items.image' } } },
      { $sort: { totalQty: -1 } }, { $limit: 5 },
      { $project: { _id: 0, title: '$_id', totalQty: 1, totalRevenue: 1, image: 1 } }
    ]);

    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(10).populate('userId', 'username name email').lean();

    database.info('Dashboard admin consultado');
    res.json({ stats: { totalUsers, totalOrders, totalRevenue, totalProducts }, topBuyers, bestSelling, recentOrders });
  } catch (err) {
    database.error(`Erro dashboard: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── GET /api/admin/products ─── (inclui inativos, com categoria populada e rating)
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().populate('category', 'name').sort({ createdAt: -1 }).lean();

    // Compute ratings
    const enriched = await Promise.all(products.map(async (p) => {
      const result = await Review.aggregate([
        { $match: { productId: p._id } },
        { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }
      ]);
      return {
        ...p,
        categoryName: p.category?.name || 'uncategorized',
        rating: { rate: Math.round((result[0]?.avg || 0) * 10) / 10, count: result[0]?.count || 0 },
      };
    }));

    res.json({ products: enriched });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
