import { Router } from "express";
import {
  createPerfumeController,
  deletePerfumeController,
  getPerfumeBySlugController,
  listPerfumesController,
  resetPerfumesController,
  updatePerfumeController
} from "../controllers/perfumeController.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const perfumeRoutes = Router();

perfumeRoutes.get("/", listPerfumesController);
perfumeRoutes.get("/:slug", getPerfumeBySlugController);
perfumeRoutes.post("/", requireAdmin, createPerfumeController);
perfumeRoutes.put("/:slug", requireAdmin, updatePerfumeController);
perfumeRoutes.delete("/:slug", requireAdmin, deletePerfumeController);
perfumeRoutes.post("/reset", requireAdmin, resetPerfumesController);

export default perfumeRoutes;
