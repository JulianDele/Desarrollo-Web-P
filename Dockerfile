FROM node:20-alpine
WORKDIR /app
COPY . /app
CMD ["node", "index.js"]
