FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# ✅ Копируем shared из корня проекта в папку src (где его ищет код)
COPY shared ./src/shared

RUN npm run build

CMD ["node", "dist/index.js"]