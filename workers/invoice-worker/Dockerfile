FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# ✅ Устанавливаем TypeScript и dotenv
RUN npm install -g typescript
RUN npm install dotenv

COPY . .

# ✅ Копируем shared и компилируем его в JS
COPY shared ./shared
RUN cd shared/database && tsc index.ts --outDir . --module commonjs --target es2020

RUN npm run build

CMD ["node", "dist/index.js"]