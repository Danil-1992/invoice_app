FROM node:18-alpine

WORKDIR /app

# Копируем package.json из папки server
COPY server/package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходники сервера
COPY server/ .

# ✅ Копируем shared
COPY shared ./shared

# Компилируем TypeScript
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev"]