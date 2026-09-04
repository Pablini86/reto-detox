const Redis = require("ioredis");

let client = null;
function getRedis() {
  const url = process.env.REDIS_URL;
  if (!url) return null;
  if (!client) {
    client = new Redis(url, { maxRetriesPerRequest: 2, connectTimeout: 5000 });
    client.on("error", () => {});
  }
  return client;
}

module.exports = { getRedis };
