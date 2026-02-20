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

EXPOSE 3000

CMD ["node", "index.js"]