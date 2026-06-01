# MiniShop v3 — Full-Stack E-commerce

Mini loja completa com Node.js, MongoDB Atlas, painel admin, reviews de usuários, categorias e notificações automáticas via WhatsApp Cloud API.

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Backend | Node.js (ESM) + Express 4.21 |
| Banco de dados | MongoDB Atlas + Mongoose 8.8 |
| Autenticação | bcryptjs (hash de senha) |
| Logs | Winston 3.17 (3 arquivos separados) |
| Notificações | Meta WhatsApp Cloud API |
| Frontend | Vanilla JS + CSS custom properties |
| Fontes | Playfair Display + DM Sans |

## Estrutura

```
minishop-v3/
├── models/
│   ├── User.js           → Usuários (nome, email, telefone, endereço, avatar, role)
│   ├── Product.js        → Produtos (título, preço, categoria, imagem, active flag)
│   ├── Category.js       → Categorias (nome único)
│   ├── Review.js         → Avaliações (rating 1-5, comentário, 1 por usuário/produto)
│   └── Order.js          → Pedidos (itens, total, status, rastreamento WhatsApp)
├── routes/
│   ├── auth.js           → Registro e login
│   ├── user.js           → Perfil (GET + PUT)
│   ├── products.js       → Produtos públicos + CRUD admin (rating agregado)
│   ├── categories.js     → Categorias (GET público + CRUD admin)
│   ├── reviews.js        → Avaliações por produto (GET + POST)
│   ├── orders.js         → Pedidos (POST + GET) + webhook WhatsApp
│   └── admin.js          → Login admin + dashboard com métricas
├── utils/
│   └── logger.js         → Winston: system.log, database.log, whatsapp.log
├── public/
│   ├── index.html        → SPA da loja
│   ├── index.css         → Estilos
│   ├── index.js          → Controller frontend
│   └── admin.html        → Painel administrativo
├── server.js             → Entry point (Express + MongoDB + seed do admin)
├── .env.example          → Template de variáveis de ambiente
└── package.json
```

## Como rodar

```bash
npm install
cp .env.example .env
# Preencha o .env com suas credenciais
npm start
```

| Comando | Descrição |
|---------|-----------|
| `npm start` | Servidor de produção |
| `npm run dev` | Servidor com hot reload (`--watch`) |

- **Loja:** http://localhost:3000
- **Admin:** http://localhost:3000/admin

## Configuração (.env)

```env
MONGO_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/minishop

ADMIN_USER=admin
ADMIN_PASS=admin123
ADMIN_EMAIL=admin@minishop.com

WA_TOKEN=seu_token_whatsapp
WA_PHONE_ID=seu_phone_id
WA_TEMPLATE_NAME=order_confirmed
WA_TEMPLATE_LANG=pt_BR

PORT=3000
```

Na primeira inicialização, o servidor cria automaticamente o usuário admin com as credenciais definidas no `.env`.

## Funcionalidades

### Loja (/)

- Listagem de produtos com filtro por categoria
- Página individual do produto com descrição completa
- Sistema de reviews: usuários logados avaliam com 1–5 estrelas + comentário
- Rating calculado automaticamente pela média das avaliações (agregação MongoDB)
- Carrinho com quantidades e checkout
- Registro de usuário com telefone obrigatório (necessário para WhatsApp)
- Perfil com avatar, histórico de pedidos e edição de dados

### Painel Admin (/admin)

- **Dashboard:** total de usuários, pedidos, receita, produtos; top 3 compradores; 5 produtos mais vendidos; 10 pedidos recentes
- **Produtos:** CRUD completo — título, descrição, preço, categoria, imagem (upload ou URL)
- **Categorias:** criar, listar e deletar
- **Soft delete:** ativar/desativar produtos sem apagar do banco
- **Rating:** exibido como read-only, controlado pelos reviews dos usuários

### WhatsApp

- Confirmação de pedido enviada automaticamente ao criar um pedido
- Template configurável via `.env` (`order_confirmed` por padrão)
- Parâmetros do template: nome do cliente (header), ID do pedido + total (body)
- Formatação automática para o formato brasileiro (+55)
- Rastreamento: `whatsappMsgId` e `whatsappSent` salvos no pedido

## API — Endpoints principais

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/register` | Registrar usuário |
| POST | `/api/auth/login` | Login |
| GET | `/api/products` | Listar produtos ativos |
| GET | `/api/products/:id` | Detalhe do produto |
| GET | `/api/reviews/:productId` | Reviews + média de rating |
| POST | `/api/reviews` | Submeter avaliação |
| GET | `/api/categories` | Listar categorias |
| POST | `/api/orders` | Criar pedido + dispara WhatsApp |
| GET | `/api/orders/:userId` | Histórico de pedidos |
| GET | `/api/user/:id` | Perfil do usuário |
| PUT | `/api/user/:id` | Atualizar perfil |
| POST | `/api/admin/login` | Login admin |
| GET | `/api/admin/dashboard` | Métricas do dashboard |

## Logs

Três arquivos gerados em `logs/` (5 MB máx, 5 backups cada):

| Arquivo | Conteúdo |
|---------|---------|
| `system.log` | Requisições HTTP, inicialização, erros gerais, ações admin |
| `database.log` | Operações MongoDB (users, products, orders) |
| `whatsapp.log` | Requisições e respostas da API, message IDs, falhas |
