FROM node:22-alpine

WORKDIR /app/Back-end

COPY Back-end/package*.json ./
RUN npm ci --omit=dev

COPY Back-end ./

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "server.js"]
