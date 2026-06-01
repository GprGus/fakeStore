import { Router } from 'express';
import prisma from '../lib/db.js';
import { database } from '../utils/logger.js';

const router = Router();

// ─── GET /api/categories ─── (público)
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
    res.json({ categories: categories.map(c => ({ ...c, _id: c.id })) });
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

    const normalized = name.trim().toLowerCase();
    const exists = await prisma.category.findUnique({ where: { name: normalized } });
    if (exists) return res.status(409).json({ error: 'Category already exists' });

    const category = await prisma.category.create({ data: { name: normalized } });
    database.info(`Categoria criada: "${category.name}" (${category.id})`);
    res.status(201).json({ category: { ...category, _id: category.id } });
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

    const category = await prisma.category.update({
      where: { id: parseInt(req.params.id) },
      data: { name: name.trim().toLowerCase() },
    });

    database.info(`Categoria atualizada: "${category.name}"`);
    res.json({ category: { ...category, _id: category.id } });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Category not found' });
    database.error(`Erro ao atualizar categoria: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── DELETE /api/categories/:id ─── (admin)
router.delete('/:id', async (req, res) => {
  try {
    const category = await prisma.category.delete({ where: { id: parseInt(req.params.id) } });
    database.info(`Categoria deletada: "${category.name}"`);
    res.json({ success: true });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Category not found' });
    database.error(`Erro ao deletar categoria: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
