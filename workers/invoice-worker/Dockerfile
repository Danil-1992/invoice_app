FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# ✅ Копируем уже скомпилированный shared
COPY shared ./shared

RUN npm run build

CMD ["node", "dist/index.js"]