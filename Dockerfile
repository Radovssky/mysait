# syntax=docker/dockerfile:1.7

# ===== базовый образ =====
FROM node:20-alpine AS base
RUN corepack enable
WORKDIR /app

# ===== установка зависимостей через pnpm =====
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm fetch

# ===== билд Next.js standalone =====
FROM base AS builder
COPY --from=deps /app/node_modules /app/node_modules
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --offline --frozen-lockfile
COPY . .
RUN pnpm build

# ===== runtime =====
FROM node:20-alpine AS runner
WORKDIR /app

# wget — для healthcheck из docker-compose.yml.
# Не-root пользователь — чтобы контейнер не работал из-под root.
RUN apk add --no-cache wget \
    && addgroup -S nodejs -g 1001 \
    && adduser -S nextjs -u 1001 -G nodejs

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# uploads volume mount-ится в /var/data/uploads из docker-compose.yml
RUN mkdir -p /var/data/uploads && chown -R nextjs:nodejs /var/data/uploads

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
