FROM node:20-alpine

RUN apk add --no-cache chromium

WORKDIR /app

COPY workers/pdf-worker/package*.json ./
RUN npm install

COPY workers/pdf-worker/ .

# ✅ Копируем шаблоны из правильного пути
COPY workers/pdf-worker/src/templates /app/dist/templates

RUN npm run build

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

CMD ["node", "dist/index.js"]