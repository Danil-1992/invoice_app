FROM node:20-alpine

RUN apk add --no-cache chromium

WORKDIR /app

# Копируем package.json из правильной папки
COPY workers/pdf-worker/package*.json ./

RUN npm install

# Копируем весь код воркера
COPY workers/pdf-worker/ .

# Копируем shared (находится в корне проекта)
COPY shared ./shared

RUN npm run build

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

CMD ["node", "dist/index.js"]