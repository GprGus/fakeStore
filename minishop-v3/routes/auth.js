import { Router } from 'express';
import User from '../models/User.js';
import { system, database } from '../utils/logger.js';

const router = Router();

// ─── POST /api/auth/register ───
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, firstname, lastname, phone } = req.body;
    system.info(`Registro solicitado: ${username} (${email})`);

    if (!username || !email || !password || !phone) {
      system.warn(`Registro rejeitado: campos obrigatórios faltando`);
      return res.status(400).json({ error: 'Username, email, password and phone are required' });
    }

    const exists = await User.findOne({ $or: [{ username }, { email }] });
    if (exists) {
      const field = exists.username === username.toLowerCase() ? 'Username' : 'Email';
      database.warn(`Registro duplicado: ${field} "${username}" já existe`);
      return res.status(409).json({ error: `${field} already taken` });
    }

    const user = await User.create({
      username, email, password, phone,
      name: { firstname: firstname || '', lastname: lastname || '' },
    });

    database.info(`Usuário criado: ${user.username} (${user._id})`, {
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
    });

    res.status(201).json({ user: user.toPublic() });
  } catch (err) {
    system.error(`Erro no registro: ${err.message}`);
    database.error(`Falha ao criar usuário: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── POST /api/auth/login ───
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    system.info(`Login solicitado: ${username}`);

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
      database.warn(`Login falhou: usuário "${username}" não encontrado`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      system.warn(`Login falhou: senha incorreta para "${username}"`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    database.info(`Login bem-sucedido: ${user.username} (${user._id})`);
    res.json({ user: user.toPublic() });
  } catch (err) {
    system.error(`Erro no login: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
