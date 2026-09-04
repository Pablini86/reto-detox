const { getRedis } = require("../lib/redis");

// Llave separada de la app de calistenia para que puedan compartir la misma
// base de datos Redis sin pisarse.
const DATA_KEY = "alimentacion:logs";

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");

  const expectedPassword = process.env.APP_PASSWORD;
  if (!expectedPassword) {
    res.status(500).json({ error: "Falta configurar la variable APP_PASSWORD en Vercel" });
    return;
  }
  const givenPassword = req.headers["x-app-password"];
  if (givenPassword !== expectedPassword) {
    res.status(401).json({ error: "Contraseña incorrecta" });
    return;
  }

  const redis = getRedis();
  if (!redis) {
    res.status(500).json({ error: "Base de datos no configurada: falta la variable REDIS_URL en Vercel" });
    return;
  }

  try {
    if (req.method === "GET") {
      const raw = await redis.get(DATA_KEY);
      if (!raw) {
        res.status(200).json({ data: null, updatedAt: 0 });
        return;
      }
      res.status(200).json(JSON.parse(raw));
      return;
    }

    if (req.method === "POST") {
      let body = req.body;
      if (typeof body === "string") body = JSON.parse(body);
      if (!body || !Array.isArray(body.data)) {
        res.status(400).json({ error: "Falta 'data' (arreglo) en el cuerpo de la petición" });
        return;
      }
      const updatedAt = Date.now();
      await redis.set(DATA_KEY, JSON.stringify({ data: body.data, updatedAt }));
      res.status(200).json({ ok: true, updatedAt });
      return;
    }

    res.status(405).json({ error: "Método no permitido" });
  } catch (err) {
    res.status(500).json({ error: String((err && err.message) || err) });
  }
};
