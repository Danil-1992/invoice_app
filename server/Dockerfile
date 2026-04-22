FROM node:18-alpine

WORKDIR /app

COPY server/package*.json ./
RUN npm install

COPY server/ .
COPY shared ./shared

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev"]
