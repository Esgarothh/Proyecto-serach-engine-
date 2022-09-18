FROM node
WORKDIR /src
COPY . .
ADD package*.json ./
RUN npm install nodemon
RUN npm install ioredis
RUN npm install
CMD ["node", "index.js"]