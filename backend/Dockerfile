FROM node:22-slim

WORKDIR /app

ENV NODE_ENV=production
ENV TZ=America/Santiago

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY src ./src

USER node

EXPOSE 3000

CMD ["node", "src/server.js"]
