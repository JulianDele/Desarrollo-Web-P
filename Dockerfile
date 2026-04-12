FROM node:22-alpine

WORKDIR /app/Back-end

COPY Back-end/package*.json ./
RUN npm ci --omit=dev

COPY Back-end ./

ENV NODE_ENV=production

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=3 \
  CMD node -e "const http=require('http');const port=process.env.PORT||3000;http.get({host:'127.0.0.1',port,path:'/api/health'},r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1));"

CMD ["node", "server.js"]
