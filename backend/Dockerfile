FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json .
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

FROM node:16-alpine AS prod
WORKDIR /app
COPY package*.json .
RUN npm ci --no-audit --no-fund --omit=dev && npm i --no-audit --no-fund -g pm2
COPY --from=builder /app/dist ./dist
COPY ecosystem.config.js .
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
