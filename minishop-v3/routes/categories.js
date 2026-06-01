import { Router } from 'express';
import Category from '../models/Category.js';
import { database } from '../utils/logger.js';

const router = Router();

// ─── GET /api/categories ─── (público)
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 }).lean();
    res.json({ categories });
  } catch (err) {
    database.error(`Erro ao listar categorias: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── POST /api/categories ─── (admin)
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: 'Name is required' });

    const exists = await Category.findOne({ name: name.trim().toLowerCase() });
    if (exists) return res.status(409).json({ error: 'Category already exists' });

    const category = await Category.create({ name: name.trim().toLowerCase() });
    database.info(`Categoria criada: "${category.name}" (${category._id})`);
    res.status(201).json({ category: category.toObject() });
  } catch (err) {
    database.error(`Erro ao criar categoria: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── PUT /api/categories/:id ─── (admin)
router.put('/:id', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: 'Name is required' });

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name: name.trim().toLowerCase() },
      { new: true }
    );
    if (!category) return res.status(404).json({ error: 'Category not found' });

    database.info(`Categoria atualizada: "${category.name}"`);
    res.json({ category: category.toObject() });
  } catch (err) {
    database.error(`Erro ao atualizar categoria: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── DELETE /api/categories/:id ─── (admin)
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });

    database.info(`Categoria deletada: "${category.name}"`);
    res.json({ success: true });
  } catch (err) {
    database.error(`Erro ao deletar categoria: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
