FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# ✅ Копируем shared и компилируем его
COPY shared ./shared
RUN cd shared/database && npx tsc index.ts --outDir . --module commonjs || true

RUN npm run build

CMD ["node", "dist/index.js"]