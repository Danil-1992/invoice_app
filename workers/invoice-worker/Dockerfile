FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# ✅ Устанавливаем TypeScript глобально
RUN npm install -g typescript

COPY . .

# ✅ Копируем shared и компилируем всю папку database в JS (игнорируем корневой tsconfig)
COPY shared ./shared
RUN mv /app/tsconfig.json /app/tsconfig.json.bak || true
RUN cd shared/database && tsc index.ts --outDir . --module commonjs --target es2020 --esModuleInterop --allowJs --skipLibCheck
RUN mv /app/tsconfig.json.bak /app/tsconfig.json || true

RUN npm run build

CMD ["node", "dist/index.js"]