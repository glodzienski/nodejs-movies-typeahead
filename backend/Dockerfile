FROM node:16-buster

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma

ENV DATABASE_URL="postgres://postgres:postgres@postgres:5432/ablefy"

RUN npm install --ignore-scripts
RUN npx prisma generate

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]
