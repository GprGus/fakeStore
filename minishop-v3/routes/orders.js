import { Router } from 'express';
import prisma from '../lib/db.js';
import { database, whatsapp } from '../utils/logger.js';

const router = Router();

// ─── WhatsApp config ───
const WA_TOKEN    = process.env.WA_TOKEN;
const WA_PHONE_ID = process.env.WA_PHONE_ID;
const WA_TEMPLATE = process.env.WA_TEMPLATE_NAME || 'order_confirmed';
const WA_LANG     = process.env.WA_TEMPLATE_LANG || 'pt_BR';
const WA_API_URL  = `https://graph.facebook.com/v21.0/${WA_PHONE_ID}/messages`;

async function sendWhatsApp(phone, customerName, orderId, total) {
  let formatted = phone.replace(/\D/g, '');
  if (formatted.startsWith('0')) formatted = formatted.slice(1);
  if (!formatted.startsWith('55')) formatted = '55' + formatted;

  const waBody = {
    messaging_product: 'whatsapp',
    to: formatted,
    type: 'template',
    template: {
      name: WA_TEMPLATE,
      language: { code: WA_LANG },
      components: [
        { type: 'header', parameters: [{ type: 'text', text: customerName }] },
        { type: 'body',   parameters: [{ type: 'text', text: orderId }, { type: 'text', text: total }] },
      ],
    },
  };

  whatsapp.info(`Enviando mensagem para ${formatted}`, { to: formatted, template: WA_TEMPLATE, orderId, customerName, total });
  whatsapp.debug('Request body', { url: WA_API_URL, body: waBody });

  const startTime = Date.now();
  const response = await fetch(WA_API_URL, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${WA_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(waBody),
  });

  const data = await response.json();
  const elapsed = Date.now() - startTime;

  if (!response.ok) {
    whatsapp.error(`API retornou ${response.status} (${elapsed}ms)`, { status: response.status, error: data.error, to: formatted, orderId });
    throw new Error(data.error?.message || 'WhatsApp API error');
  }

  const msgId = data.messages?.[0]?.id;
  whatsapp.info(`Mensagem enviada com sucesso (${elapsed}ms)`, { status: response.status, messageId: msgId, to: formatted, orderId, contacts: data.contacts });
  return msgId;
}

// ─── POST /api/orders ───
router.post('/', async (req, res) => {
  try {
    const { userId, items, total } = req.body;

    if (!userId || !items?.length || total == null) {
      return res.status(400).json({ error: 'userId, items and total are required' });
    }

    const uid = parseInt(userId);
    const user = await prisma.user.findUnique({ where: { id: uid } });
    if (!user) {
      database.warn(`Pedido rejeitado: usuário ${uid} não encontrado`);
      return res.status(404).json({ error: 'User not found' });
    }

    const orderCount = await prisma.order.count({ where: { userId: uid } });
    const orderId = `ORD-${String(orderCount + 1).padStart(4, '0')}`;

    const order = await prisma.order.create({
      data: {
        userId: uid,
        orderId,
        total: parseFloat(total),
        status: 'completed',
        items: {
          create: items.map(i => ({
            productId: parseInt(i.productId),
            title: i.title,
            price: parseFloat(i.price),
            quantity: parseInt(i.quantity),
            image: i.image || '',
          })),
        },
      },
      include: { items: true },
    });

    database.info(`Pedido criado: ${orderId} para ${user.username}`, {
      orderId, userId: user.id, username: user.username, itemCount: items.length, total,
    });

    let whatsappSent = false;

    if (user.phone && WA_TOKEN) {
      try {
        const customerName = `${user.firstname} ${user.lastname}`.trim() || user.username;
        const msgId = await sendWhatsApp(user.phone, customerName, orderId, `$${parseFloat(total).toFixed(2)}`);
        whatsappSent = true;
        await prisma.order.update({ where: { id: order.id }, data: { whatsappSent: true, whatsappMsgId: msgId } });
        database.info(`Pedido ${orderId} atualizado: whatsappSent=true`);
      } catch (waErr) {
        whatsapp.error(`Falha no envio para pedido ${orderId}: ${waErr.message}`);
      }
    } else {
      const reason = !user.phone ? 'telefone não cadastrado' : 'WA_TOKEN não configurado';
      whatsapp.warn(`WhatsApp não enviado para ${orderId}: ${reason}`);
    }

    res.status(201).json({ order: { ...order, _id: order.id }, whatsappSent });
  } catch (err) {
    database.error(`Erro ao criar pedido: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── GET /api/orders/:userId ───
router.get('/:userId', async (req, res) => {
  try {
    const uid = parseInt(req.params.userId);
    const orders = await prisma.order.findMany({
      where: { userId: uid },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    database.info(`Pedidos consultados: ${orders.length} pedidos para ${uid}`);
    res.json({ orders: orders.map(o => ({ ...o, _id: o.id })) });
  } catch (err) {
    database.error(`Erro ao buscar pedidos de ${req.params.userId}: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
