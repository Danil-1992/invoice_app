FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# ✅ Устанавливаем dotenv
RUN npm install dotenv

COPY . .

# ✅ Копируем shared
COPY shared ./shared

RUN npm run build

CMD ["node", "dist/index.js"]