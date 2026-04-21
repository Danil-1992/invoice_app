# workers/invoice-worker/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# Создаем симлинк на shared
RUN mkdir -p src && ln -sf ../shared src/shared

COPY src ./src
COPY shared ./shared

CMD ["npm", "run", "dev"]