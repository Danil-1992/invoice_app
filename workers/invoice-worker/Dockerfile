FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# ✅ Устанавливаем TypeScript глобально
RUN npm install -g typescript

COPY . .

# ✅ Копируем shared и компилируем его во временную папку
COPY shared ./shared
RUN cd shared/database && tsc index.ts --outDir ./compiled --module commonjs --target es2020 --esModuleInterop --skipLibCheck

# ✅ Заменяем исходные файлы скомпилированными
RUN cp shared/database/compiled/* shared/database/ -r

RUN npm run build

CMD ["node", "dist/index.js"]