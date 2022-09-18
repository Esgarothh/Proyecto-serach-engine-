FROM node
WORKDIR /src
COPY . .
ADD package*.json ./
RUN npm install nodemon:latest
RUN npm install ioredis:latest
RUN npm install
CMD ["node", "index.js"]