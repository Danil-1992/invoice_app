FROM node:20-alpine

RUN apk add --no-cache chromium

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
COPY shared ./shared

RUN npm run build

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

CMD ["node", "dist/index.js"]
