FROM node:22-alpine AS deps
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@11.0.9 --activate
COPY package.json pnpm-lock.yaml* ./
COPY front/package.json ./front/
RUN pnpm install --filter front --frozen-lockfile

FROM node:22-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@11.0.9 --activate
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/front/node_modules ./front/node_modules
COPY pnpm-workspace.yaml package.json ./
COPY front ./front
RUN pnpm --filter front build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/front/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/front/.next/static ./front/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/front/public ./front/public

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
CMD ["node", "front/server.js"]
