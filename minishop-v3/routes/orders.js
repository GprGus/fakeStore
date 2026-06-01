import { Router } from 'express';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { database, whatsapp } from '../utils/logger.js';

const router = Router();

// ─── WhatsApp config ───
const WA_TOKEN    = process.env.WA_TOKEN;
const WA_PHONE_ID = process.env.WA_PHONE_ID;
const WA_TEMPLATE = process.env.WA_TEMPLATE_NAME || 'order_confirmed';
const WA_LANG     = process.env.WA_TEMPLATE_LANG || 'pt_BR';
const WA_API_URL  = `https://graph.facebook.com/v21.0/${WA_PHONE_ID}/messages`;

// ─── Helper: envia WhatsApp (com logging completo) ───
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
        {
          type: 'header',
          parameters: [{ type: 'text', text: customerName }],
        },
        {
          type: 'body',
          parameters: [
            { type: 'text', text: orderId },
            { type: 'text', text: total },
          ],
        }
      ]
    }
  };

  whatsapp.info(`Enviando mensagem para ${formatted}`, {
    to: formatted,
    template: WA_TEMPLATE,
    orderId,
    customerName,
    total,
  });

  whatsapp.debug('Request body', { url: WA_API_URL, body: waBody });

  const startTime = Date.now();
  const response = await fetch(WA_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${WA_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(waBody),
  });

  const data = await response.json();
  const elapsed = Date.now() - startTime;

  if (!response.ok) {
    whatsapp.error(`API retornou ${response.status} (${elapsed}ms)`, {
      status: response.status,
      error: data.error,
      to: formatted,
      orderId,
    });
    throw new Error(data.error?.message || 'WhatsApp API error');
  }

  const msgId = data.messages?.[0]?.id;
  whatsapp.info(`Mensagem enviada com sucesso (${elapsed}ms)`, {
    status: response.status,
    messageId: msgId,
    to: formatted,
    orderId,
    contacts: data.contacts,
  });

  return msgId;
}

// ─── POST /api/orders ───
router.post('/', async (req, res) => {
  try {
    const { userId, items, total } = req.body;

    if (!userId || !items?.length || total == null) {
      return res.status(400).json({ error: 'userId, items and total are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      database.warn(`Pedido rejeitado: usuário ${userId} não encontrado`);
      return res.status(404).json({ error: 'User not found' });
    }

    const orderCount = await Order.countDocuments({ userId });
    const orderId = `ORD-${String(orderCount + 1).padStart(4, '0')}`;

    const order = await Order.create({
      userId, orderId, items, total, status: 'completed',
    });

    database.info(`Pedido criado: ${orderId} para ${user.username}`, {
      orderId,
      userId: user._id.toString(),
      username: user.username,
      itemCount: items.length,
      total,
    });

    // Envia WhatsApp
    let whatsappSent = false;
    let whatsappMsgId = null;

    if (user.phone && WA_TOKEN) {
      try {
        const customerName = `${user.name.firstname} ${user.name.lastname}`.trim() || user.username;
        whatsappMsgId = await sendWhatsApp(user.phone, customerName, orderId, `$${total.toFixed(2)}`);
        whatsappSent = true;
        order.whatsappSent = true;
        order.whatsappMsgId = whatsappMsgId;
        await order.save();

        database.info(`Pedido ${orderId} atualizado: whatsappSent=true`);
      } catch (waErr) {
        whatsapp.error(`Falha no envio para pedido ${orderId}: ${waErr.message}`);
      }
    } else {
      const reason = !user.phone ? 'telefone não cadastrado' : 'WA_TOKEN não configurado';
      whatsapp.warn(`WhatsApp não enviado para ${orderId}: ${reason}`);
    }

    res.status(201).json({ order: order.toObject(), whatsappSent });
  } catch (err) {
    database.error(`Erro ao criar pedido: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── GET /api/orders/:userId ───
router.get('/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .lean();

    database.info(`Pedidos consultados: ${orders.length} pedidos para ${req.params.userId}`);
    res.json({ orders });
  } catch (err) {
    database.error(`Erro ao buscar pedidos de ${req.params.userId}: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
