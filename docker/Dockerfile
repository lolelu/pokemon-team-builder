FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY prisma ./
COPY package.json pnpm-lock.yaml* ./


RUN yarn global add pnpm && pnpm i

FROM node:20-alpine AS builder
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .




RUN yarn global add pnpm 

RUN SKIP_ENV_VALIDATION=1 pnpm run build
# Run prisma commands


FROM node:20-alpine  AS runner
WORKDIR /app

ENV NODE_ENV production
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}


COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/docker/migrate-and-start.sh .

RUN apk add --no-cache bash

EXPOSE 3000
ENV PORT 3000

RUN chmod +x migrate-and-start.sh

CMD ["bash", "migrate-and-start.sh"] 
