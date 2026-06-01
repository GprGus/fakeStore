import { Router } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../lib/db.js';
import { formatUser } from '../lib/format.js';
import { system, database } from '../utils/logger.js';

const router = Router();

// ─── POST /api/auth/register ───
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, firstname, lastname, phone } = req.body;
    system.info(`Registro solicitado: ${username} (${email})`);

    if (!username || !email || !password || !phone) {
      system.warn('Registro rejeitado: campos obrigatórios faltando');
      return res.status(400).json({ error: 'Username, email, password and phone are required' });
    }

    const exists = await prisma.user.findFirst({
      where: { OR: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }] },
    });
    if (exists) {
      const field = exists.username === username.toLowerCase() ? 'Username' : 'Email';
      database.warn(`Registro duplicado: ${field} "${username}" já existe`);
      return res.status(409).json({ error: `${field} already taken` });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password: hashed,
        firstname: firstname || '',
        lastname: lastname || '',
        phone,
      },
    });

    database.info(`Usuário criado: ${user.username} (${user.id})`);
    res.status(201).json({ user: formatUser(user) });
  } catch (err) {
    system.error(`Erro no registro: ${err.message}`);
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

    const user = await prisma.user.findUnique({ where: { username: username.toLowerCase() } });
    if (!user) {
      database.warn(`Login falhou: usuário "${username}" não encontrado`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      system.warn(`Login falhou: senha incorreta para "${username}"`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    database.info(`Login bem-sucedido: ${user.username} (${user.id})`);
    res.json({ user: formatUser(user) });
  } catch (err) {
    system.error(`Erro no login: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
