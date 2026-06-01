FROM node:20-alpine

WORKDIR /app

# Copy package files and Prisma schema first (layer cache)
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (prisma CLI needed for migrate deploy)
RUN npm install

# Generate Prisma client from schema
RUN npx prisma generate

# Copy remaining source files
COPY . .

EXPOSE 3000

# Run migrations then start server
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
