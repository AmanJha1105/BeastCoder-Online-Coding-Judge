FROM node:18-alpine
WORKDIR /app
RUN apk update && apk add --no-cache g++ gcc python3 openjdk11
COPY package*.json .
RUN npm i
COPY . .
EXPOSE 5000
CMD ["node","index.js"]