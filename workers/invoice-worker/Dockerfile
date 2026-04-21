FROM node:18-alpine

WORKDIR /app

# Копируем package.json из правильной папки
COPY workers/invoice-worker/package*.json ./

RUN npm install

# Копируем весь код воркера
COPY workers/invoice-worker/ .

# Копируем shared (находится в корне проекта)
COPY shared ./shared

RUN npm run build

CMD ["node", "dist/index.js"]