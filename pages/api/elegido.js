import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { token } = req.query;
    
    if (!token) {
      return res.status(400).json({ error: "Token requerido" });
    }

    const email = await kv.get(`token:${token}`);
    
    if (!email) {
      return res.status(404).json({ error: "Token invalido" });
    }

    const elegido = await kv.get(`elegido:${email}`);
    
    if (!elegido) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const { token: _, ...elegidoSinToken } = elegido;

    return res.status(200).json(elegidoSinToken);

  } catch (error) {
    console.error("[ELEGIDO] Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
