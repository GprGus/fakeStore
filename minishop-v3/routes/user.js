import { Router } from 'express';
import User from '../models/User.js';
import { database } from '../utils/logger.js';

const router = Router();

// ─── GET /api/user/:id ───
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      database.warn(`Usuário não encontrado: ${req.params.id}`);
      return res.status(404).json({ error: 'User not found' });
    }
    database.info(`Perfil consultado: ${user.username} (${user._id})`);
    res.json({ user: user.toPublic() });
  } catch (err) {
    database.error(`Erro ao buscar usuário ${req.params.id}: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── PUT /api/user/:id ───
router.put('/:id', async (req, res) => {
  try {
    const { firstname, lastname, phone, address, avatar, newPassword } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      database.warn(`Update falhou: usuário ${req.params.id} não encontrado`);
      return res.status(404).json({ error: 'User not found' });
    }

    // Registra quais campos estão sendo atualizados
    const changedFields = [];
    if (firstname !== undefined) { user.name.firstname = firstname; changedFields.push('firstname'); }
    if (lastname !== undefined)  { user.name.lastname = lastname; changedFields.push('lastname'); }
    if (phone !== undefined)     { user.phone = phone; changedFields.push('phone'); }
    if (address !== undefined)   { user.address = address; changedFields.push('address'); }
    if (avatar !== undefined)    { user.avatar = avatar; changedFields.push('avatar'); }
    if (newPassword)             { user.password = newPassword; changedFields.push('password'); }

    await user.save();

    database.info(`Perfil atualizado: ${user.username} (${user._id})`, {
      userId: user._id.toString(),
      fieldsChanged: changedFields,
    });

    res.json({ user: user.toPublic() });
  } catch (err) {
    database.error(`Erro ao atualizar ${req.params.id}: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
