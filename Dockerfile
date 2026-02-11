FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
RUN apk add --no-cache libc6-compat openssl
COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts;

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN chmod -R +x ./node_modules/.bin

RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate --config ./prisma.config.ts

RUN npm run prebuild;

RUN npm run build;

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup -S nodejs && adduser -S nestjs -G nodejs

COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nestjs:nodejs /app/prisma.config.ts ./prisma.config.ts

USER nestjs
EXPOSE 3100
ENV PORT=3100

CMD ["sh", "-c", "npx prisma generate --config ./prisma.config.ts && npx prisma migrate deploy --config ./prisma.config.ts && node dist/src/main.js"]