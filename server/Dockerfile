FROM node:18-alpine

WORKDIR /app

# Копируем package.json (теперь из текущей папки, так как контекст — ./server)
COPY package*.json ./

RUN npm install

# Копируем всё содержимое папки server
COPY . .

# Копируем shared (поднимаемся на уровень выше)
COPY ../shared ./shared

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev"]