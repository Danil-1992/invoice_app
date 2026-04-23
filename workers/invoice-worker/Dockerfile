FROM node:18-alpine

WORKDIR /app

COPY workers/invoice-worker/package*.json ./
RUN npm install

COPY workers/invoice-worker/ .
COPY shared ./shared

RUN npm run build

# ✅ Копируем shared в dist после сборки
RUN cp -r shared dist/ 2>/dev/null || true

CMD ["node", "dist/index.js"]