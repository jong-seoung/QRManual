# NestJS multi-stage 빌드
FROM node:22-alpine AS deps
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@11.0.9 --activate
COPY package.json pnpm-lock.yaml* ./
COPY back/package.json ./back/
RUN pnpm fetch
RUN pnpm install --filter back --frozen-lockfile --prod=false || pnpm install --filter back

FROM node:22-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@11.0.9 --activate
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/back/node_modules ./back/node_modules
COPY pnpm-workspace.yaml package.json ./
COPY back ./back
RUN pnpm --filter back build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nestjs

COPY --from=builder --chown=nestjs:nodejs /app/back/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/back/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/back/package.json ./package.json
COPY --from=builder --chown=nestjs:nodejs /app/back/drizzle ./drizzle

USER nestjs
EXPOSE 8080
CMD ["node", "dist/main.js"]
