import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  createPerfume,
  deletePerfume,
  getPerfumeBySlug,
  listPerfumes,
  resetPerfumes,
  updatePerfume
} from "../services/perfumeService.js";

export const listPerfumesController = asyncHandler(async (_req, res) => {
  const perfumes = await listPerfumes();
  res.json(perfumes);
});

export const getPerfumeBySlugController = asyncHandler(async (req, res) => {
  const perfume = await getPerfumeBySlug(req.params.slug);
  res.json(perfume);
});

export const createPerfumeController = asyncHandler(async (req, res) => {
  const perfume = await createPerfume(req.body);
  res.status(201).json(perfume);
});

export const updatePerfumeController = asyncHandler(async (req, res) => {
  const perfume = await updatePerfume(req.params.slug, req.body);
  res.json(perfume);
});

export const deletePerfumeController = asyncHandler(async (req, res) => {
  await deletePerfume(req.params.slug);
  res.status(204).send();
});

export const resetPerfumesController = asyncHandler(async (_req, res) => {
  const perfumes = await resetPerfumes();
  res.json(perfumes);
});
