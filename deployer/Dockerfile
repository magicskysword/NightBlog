FROM node:18

WORKDIR /app

COPY server.js deploy.js ./

RUN npm install

EXPOSE 3000

CMD ["node", "server.js"]
