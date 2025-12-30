FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY  package.json pnpm-lock.yaml* ./

RUN pnpm install --frozen-lockfile

COPY  . .

RUN pnpm build



FROM node:20-alpine AS production

WORKDIR /app

COPY package.json pnpm-lock.yaml ./


RUN npm install -g pnpm \
  && pnpm install --frozen-lockfile --prod \
  && pnpm store prune \
  && rm -rf /root/.npm

COPY --from=builder /app/dist ./dist
EXPOSE 3131
CMD [ "node", "dist/index.js" ]
