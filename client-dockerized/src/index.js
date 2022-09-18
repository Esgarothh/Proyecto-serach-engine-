const Redis = require('ioredis');

const redisDemo = async () => {
  
  const redisClient = new Redis.Cluster([
    {
      port: 8000,
      host: "172.20.0.31",
    },
    {
      port: 8001,
      host: "172.20.0.32",
    },
    {
      port: 8002,
      host: "172.20.0.33",
    },
    {
      port: 8003,
      host: "172.20.0.34",
    },
    {
      port: 8004,
      host: "172.20.0.35",
    },
    {
      port: 8005,
      host: "172.20.0.36",
    },
  ]);

  // Set key "myname" to have value "Simon Prickett".
  await redisClient.set('myname', 'Simon Prickett');

  // Get the value held at key "myname" and log it.
  const value = await redisClient.get('myname');
  console.log(value);
  const value2  = await redisClient.set('nombre', 'matias');
  console.log(value2);
  // Disconnect from Redis.
  redisClient.quit();
};

redisDemo();