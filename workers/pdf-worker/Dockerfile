FROM node:20-alpine

# Устанавливаем Chromium для Puppeteer
RUN apk add --no-cache chromium

WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем исходники (для volume они перезапишутся)
COPY src ./src
COPY tsconfig.json ./

# Указываем путь к Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Запускаем через ts-node (для разработки с volume)
CMD ["npm", "run", "dev"]