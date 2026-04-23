FROM node:18-alpine

WORKDIR /app

COPY workers/invoice-worker/package*.json ./
RUN npm install

COPY workers/invoice-worker/ .

# ✅ Копируем shared из корня проекта (контекст сборки — корень)
COPY shared ./shared

RUN npm run build

CMD ["node", "dist/index.js"]