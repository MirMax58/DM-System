FROM node:22-alpine AS builder

WORKDIR /workspace

COPY package.json package-lock.json ./
COPY app/package.json ./app/package.json
COPY app/packages ./app/packages
COPY app/desktop/package.json ./app/desktop/package.json

RUN npm ci --workspace dm-system-web --include-workspace-root=false

COPY app ./app

WORKDIR /workspace/app

ARG VITE_GRAPHQL_URL=http://localhost:4001/
ENV VITE_GRAPHQL_URL=$VITE_GRAPHQL_URL

RUN npm run build

FROM nginx:alpine

LABEL maintainer="Maxim Myroshnichenko"
LABEL description="DM-System Web Application"

COPY --from=builder /workspace/app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
