FROM node:20-alpine

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

WORKDIR /app

COPY client/package*.json ./
RUN npm install

COPY client/ .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
