import { env } from "../config/env.js";
import { HttpError } from "../utils/httpError.js";

export function requireAdmin(req, _res, next) {
  const password = req.header("x-admin-password");

  if (password !== env.adminPassword) {
    next(new HttpError(401, "No autorizado."));
    return;
  }

  next();
}
