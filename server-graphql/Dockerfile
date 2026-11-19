FROM node:22-alpine

WORKDIR /app

LABEL maintainer="Maxim Myroshnichenko"
LABEL description="DM-System GraphQL API"

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

EXPOSE 4001

CMD ["npm", "start"]
