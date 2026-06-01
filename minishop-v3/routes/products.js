import { Router } from 'express';
import Product from '../models/Product.js';
import Review from '../models/Review.js';
import { database } from '../utils/logger.js';

const router = Router();

// ─── Helper: compute rating from reviews ───
async function computeRating(productId) {
  const result = await Review.aggregate([
    { $match: { productId: productId } },
    { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  return { rate: Math.round((result[0]?.avg || 0) * 10) / 10, count: result[0]?.count || 0 };
}

// ─── Helper: enrich products with rating ───
async function enrichProducts(products) {
  return Promise.all(products.map(async (p) => {
    const rating = await computeRating(p._id);
    return { ...p, rating };
  }));
}

// ─── GET /api/products ─── (público)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ active: true })
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .lean();

    const enriched = await enrichProducts(products);

    // Flatten category: { _id, name } → just the name string for frontend
    const result = enriched.map(p => ({
      ...p,
      category: p.category?.name || 'uncategorized',
      categoryId: p.category?._id || null,
    }));

    database.info(`Produtos listados: ${result.length}`);
    res.json({ products: result });
  } catch (err) {
    database.error(`Erro ao listar produtos: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── GET /api/products/:id ─── (público, página do produto)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name')
      .lean();
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const rating = await computeRating(product._id);
    const reviews = await Review.find({ productId: product._id })
      .populate('userId', 'username name avatar')
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      product: {
        ...product,
        category: product.category?.name || 'uncategorized',
        categoryId: product.category?._id || null,
        rating,
      },
      reviews,
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

    const product = await Product.create({
      title, description, price, category, image: image || '',
    });

    database.info(`Produto criado: "${product.title}" (${product._id})`);
    res.status(201).json({ product: product.toObject() });
  } catch (err) {
    database.error(`Erro ao criar produto: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── PUT /api/products/:id ─── (admin)
router.put('/:id', async (req, res) => {
  try {
    const { title, description, price, category, image, active } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    if (title !== undefined)       product.title = title;
    if (description !== undefined) product.description = description;
    if (price !== undefined)       product.price = price;
    if (category !== undefined)    product.category = category;
    if (image !== undefined)       product.image = image;
    if (active !== undefined)      product.active = active;

    await product.save();
    database.info(`Produto atualizado: "${product.title}" (${product._id})`);
    res.json({ product: product.toObject() });
  } catch (err) {
    database.error(`Erro ao atualizar produto ${req.params.id}: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── DELETE /api/products/:id ─── (admin, soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    product.active = false;
    await product.save();
    database.info(`Produto desativado: "${product.title}" (${product._id})`);
    res.json({ success: true });
  } catch (err) {
    database.error(`Erro ao deletar produto ${req.params.id}: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
