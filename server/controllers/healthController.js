import { getDatabaseHealth } from "../services/perfumeService.js";

export function getHealth(_req, res) {
  res.json({ ok: true });
}

export async function getDatabaseHealthController(_req, res, next) {
  try {
    const db = await getDatabaseHealth();
    res.json({ ok: db.connected, db });
  } catch (error) {
    next(error);
  }
}
