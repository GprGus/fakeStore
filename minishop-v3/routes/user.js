import { Router } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../lib/db.js';
import { formatUser } from '../lib/format.js';
import { database } from '../utils/logger.js';

const router = Router();

// ─── GET /api/user/:id ───
router.get('/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!user) {
      database.warn(`Usuário não encontrado: ${req.params.id}`);
      return res.status(404).json({ error: 'User not found' });
    }
    database.info(`Perfil consultado: ${user.username} (${user.id})`);
    res.json({ user: formatUser(user) });
  } catch (err) {
    database.error(`Erro ao buscar usuário ${req.params.id}: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── PUT /api/user/:id ───
router.put('/:id', async (req, res) => {
  try {
    const { firstname, lastname, phone, address, avatar, newPassword } = req.body;
    const userId = parseInt(req.params.id);

    const existing = await prisma.user.findUnique({ where: { id: userId } });
    if (!existing) {
      database.warn(`Update falhou: usuário ${userId} não encontrado`);
      return res.status(404).json({ error: 'User not found' });
    }

    const data = {};
    const changedFields = [];
    if (firstname !== undefined) { data.firstname = firstname; changedFields.push('firstname'); }
    if (lastname !== undefined)  { data.lastname = lastname;   changedFields.push('lastname'); }
    if (phone !== undefined)     { data.phone = phone;         changedFields.push('phone'); }
    if (address !== undefined)   { data.address = address;     changedFields.push('address'); }
    if (avatar !== undefined)    { data.avatar = avatar;       changedFields.push('avatar'); }
    if (newPassword)             { data.password = await bcrypt.hash(newPassword, 10); changedFields.push('password'); }

    const user = await prisma.user.update({ where: { id: userId }, data });

    database.info(`Perfil atualizado: ${user.username} (${user.id})`, { fieldsChanged: changedFields });
    res.json({ user: formatUser(user) });
  } catch (err) {
    database.error(`Erro ao atualizar ${req.params.id}: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
