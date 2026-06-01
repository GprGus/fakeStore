import { Router } from 'express';
import Review from '../models/Review.js';
import { database } from '../utils/logger.js';

const router = Router();

// ─── GET /api/reviews/:productId ───
router.get('/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId })
      .populate('userId', 'username name avatar')
      .sort({ createdAt: -1 })
      .lean();

    // Compute average
    const count = reviews.length;
    const avg = count > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / count : 0;

    database.info(`Reviews listadas: ${count} para produto ${req.params.productId}`);
    res.json({ reviews, rating: { rate: Math.round(avg * 10) / 10, count } });
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

    // Checa se já avaliou
    const existing = await Review.findOne({ productId, userId });
    if (existing) {
      return res.status(409).json({ error: 'You already reviewed this product' });
    }

    const review = await Review.create({ productId, userId, rating, comment: comment || '' });
    const populated = await Review.findById(review._id).populate('userId', 'username name avatar').lean();

    database.info(`Review criada: ${rating}★ para produto ${productId} por usuário ${userId}`);
    res.status(201).json({ review: populated });
  } catch (err) {
    database.error(`Erro ao criar review: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
