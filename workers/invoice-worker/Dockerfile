FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# ✅ Устанавливаем TypeScript глобально
RUN npm install -g typescript

COPY . .

# ✅ Копируем shared и компилируем всю папку database в JS
COPY shared ./shared
RUN cd shared/database && tsc --module commonjs --target es2020 --esModuleInterop --allowJs --skipLibCheck

RUN npm run build

CMD ["node", "dist/index.js"]