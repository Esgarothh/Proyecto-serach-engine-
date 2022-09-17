const RedisClustr = require('redis-clustr');
const RedisClient = require('redis');
const express = require("express");
const axios = require("axios");

const app = express();
const client = new RedisClustr({
  servers: [
    {
    host: '172.20.0.31',
    port: 8000,
    },
    {
      host: '172.20.0.32',
      port: 8001,
    },
    {
      host: '172.20.0.33',
      port: 8002,
    }
  ],
  createClient: function(port, host) {
    // this is the default behaviour
    return RedisClient.createClient(port, host);
  }
});


// Get all characters
app.get("/character", async (req, res, next) => {
  const response = await axios.get("https://rickandmortyapi.com/api/character/");
  res.json(response.data);
});
app.listen(3000);
console.log("server listen on port 3000");
