import { Router } from 'express';
import prisma from '../lib/db.js';
import { formatProduct, formatReview } from '../lib/format.js';
import { database } from '../utils/logger.js';

const router = Router();

async function getRating(productId) {
  const { _avg, _count } = await prisma.review.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: { id: true },
  });
  return { rate: Math.round((_avg.rating || 0) * 10) / 10, count: _count.id };
}

// ─── GET /api/products ─── (público)
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });

    const result = await Promise.all(
      products.map(async (p) => ({ ...formatProduct(p), rating: await getRating(p.id) }))
    );

    database.info(`Produtos listados: ${result.length}`);
    res.json({ products: result });
  } catch (err) {
    database.error(`Erro ao listar produtos: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── GET /api/products/:id ─── (público)
router.get('/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { category: true },
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const [rating, reviews] = await Promise.all([
      getRating(product.id),
      prisma.review.findMany({
        where: { productId: product.id },
        include: { user: true },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    res.json({
      product: { ...formatProduct(product), rating },
      reviews: reviews.map(formatReview),
    });
  } catch (err) {
    database.error(`Erro ao buscar produto ${req.params.id}: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── POST /api/products ─── (admin)
router.post('/', async (req, res) => {
  try {
    const { title, description, price, category, image } = req.body;
    if (!title || price == null || !category) {
      return res.status(400).json({ error: 'Title, price and category are required' });
    }

    const product = await prisma.product.create({
      data: {
        title,
        description: description || '',
        price: parseFloat(price),
        categoryId: parseInt(category),
        image: image || '',
      },
      include: { category: true },
    });

    database.info(`Produto criado: "${product.title}" (${product.id})`);
    res.status(201).json({ product: formatProduct(product) });
  } catch (err) {
    database.error(`Erro ao criar produto: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── PUT /api/products/:id ─── (admin)
router.put('/:id', async (req, res) => {
  try {
    const { title, description, price, category, image, active } = req.body;
    const productId = parseInt(req.params.id);

    const existing = await prisma.product.findUnique({ where: { id: productId } });
    if (!existing) return res.status(404).json({ error: 'Product not found' });

    const data = {};
    if (title !== undefined)       data.title = title;
    if (description !== undefined) data.description = description;
    if (price !== undefined)       data.price = parseFloat(price);
    if (category !== undefined)    data.categoryId = parseInt(category);
    if (image !== undefined)       data.image = image;
    if (active !== undefined)      data.active = active;

    const product = await prisma.product.update({
      where: { id: productId },
      data,
      include: { category: true },
    });

    database.info(`Produto atualizado: "${product.title}" (${product.id})`);
    res.json({ product: formatProduct(product) });
  } catch (err) {
    database.error(`Erro ao atualizar produto ${req.params.id}: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── DELETE /api/products/:id ─── (admin, soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const existing = await prisma.product.findUnique({ where: { id: productId } });
    if (!existing) return res.status(404).json({ error: 'Product not found' });

    const product = await prisma.product.update({ where: { id: productId }, data: { active: false } });
    database.info(`Produto desativado: "${product.title}" (${product.id})`);
    res.json({ success: true });
  } catch (err) {
    database.error(`Erro ao deletar produto ${req.params.id}: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
