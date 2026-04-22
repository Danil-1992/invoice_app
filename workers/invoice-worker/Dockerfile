cat > workers/invoice-worker/Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

COPY workers/invoice-worker/package*.json ./
RUN npm install

COPY workers/invoice-worker/ .
COPY shared ./shared

RUN npm run build

CMD ["node", "dist/index.js"]
EOF