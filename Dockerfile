FROM node:22-alpine

WORKDIR /app

COPY . .

# Backend deps
WORKDIR /app/Back-end
RUN npm install

# Frontend deps + build
WORKDIR /app/frontend
RUN npm install
RUN npm run build

# Production mode
ENV NODE_ENV=production

# Volver backend
WORKDIR /app/Back-end

# Healthcheck automático del contenedor
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD wget -qO- http://localhost:3000/api/health || exit 1

EXPOSE 3000

CMD ["node", "server.js"]
