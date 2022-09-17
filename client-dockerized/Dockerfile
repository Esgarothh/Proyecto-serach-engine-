FROM node

RUN npm global add nodemon
WORKDIR /src
ADD package*.json ./
RUN npm install
COPY . .

CMD ["node", "index.js"]