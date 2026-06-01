import { Router } from 'express';
import prisma from '../lib/db.js';
import { formatReview } from '../lib/format.js';
import { database } from '../utils/logger.js';

const router = Router();

// ─── GET /api/reviews/:productId ───
router.get('/:productId', async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    const reviews = await prisma.review.findMany({
      where: { productId },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });

    const count = reviews.length;
    const avg = count > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / count : 0;

    database.info(`Reviews listadas: ${count} para produto ${productId}`);
    res.json({
      reviews: reviews.map(formatReview),
      rating: { rate: Math.round(avg * 10) / 10, count },
    });
  } catch (err) {
    database.error(`Erro ao buscar reviews: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── POST /api/reviews ───
router.post('/', async (req, res) => {
  try {
    const { productId, userId, rating, comment } = req.body;

    if (!productId || !userId || !rating) {
      return res.status(400).json({ error: 'productId, userId and rating are required' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const pid = parseInt(productId);
    const uid = parseInt(userId);

    const existing = await prisma.review.findUnique({
      where: { userId_productId: { userId: uid, productId: pid } },
    });
    if (existing) return res.status(409).json({ error: 'You already reviewed this product' });

    const review = await prisma.review.create({
      data: { productId: pid, userId: uid, rating: parseInt(rating), comment: comment || '' },
      include: { user: true },
    });

    database.info(`Review criada: ${rating}★ para produto ${pid} por usuário ${uid}`);
    res.status(201).json({ review: formatReview(review) });
  } catch (err) {
    database.error(`Erro ao criar review: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
