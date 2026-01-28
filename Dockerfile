FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json* ./
RUN npm ci;

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

COPY prisma ./prisma

RUN npx prisma generate

RUN npm run build;

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup -S nodejs && adduser -S nestjs -G nodejs

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules

USER nestjs
EXPOSE 3100
ENV PORT=3100

CMD ["node", "dist/main.js"]
