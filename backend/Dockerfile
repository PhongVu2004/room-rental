FROM node:20-slim

WORKDIR /app

COPY backend/package*.json ./backend/
COPY database/package*.json ./database/

RUN apt-get update -y && apt-get install -y openssl
RUN cd backend && npm install
RUN cd database && npm install

COPY backend/ ./backend/
COPY database/ ./database/

RUN cd backend && npx prisma@5 generate --schema=../database/prisma/schema.prisma
RUN cp -r database/node_modules/.prisma backend/node_modules/ && cp -r database/node_modules/@prisma backend/node_modules/
RUN cd backend && npm run build

WORKDIR /app/backend

EXPOSE 3001

CMD ["sh", "-c", "npx prisma@5 db push --schema=../database/prisma/schema.prisma --accept-data-loss && npm run start:prod"]
