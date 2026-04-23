FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# ✅ Устанавливаем TypeScript глобально
RUN npm install -g typescript
RUN npm install dotenv

COPY . .

# ✅ Копируем shared и компилируем его в JS (игнорируем tsconfig)
COPY shared ./shared
RUN cd shared/database && tsc index.ts --outDir . --module commonjs --target es2020 --ignoreConfig

RUN npm run build

CMD ["node", "dist/index.js"]