import {
  createPerfumeInStore,
  deletePerfumeFromStore,
  getPerfumeBySlugFromStore,
  getDatabaseHealthFromStore,
  listPerfumesFromStore,
  resetPerfumesStore,
  updatePerfumeInStore
} from "../repositories/perfumeRepository.js";
import { validateAndNormalizePerfumeInput } from "../validation/perfumeValidation.js";

export async function listPerfumes() {
  return listPerfumesFromStore();
}

export async function getPerfumeBySlug(slug) {
  return getPerfumeBySlugFromStore(slug);
}

export async function createPerfume(input) {
  const normalized = validateAndNormalizePerfumeInput(input);
  return createPerfumeInStore(normalized);
}

export async function updatePerfume(slug, input) {
  const normalized = validateAndNormalizePerfumeInput(input);
  return updatePerfumeInStore(slug, normalized);
}

export async function deletePerfume(slug) {
  await deletePerfumeFromStore(slug);
}

export async function resetPerfumes() {
  return resetPerfumesStore();
}

export async function getDatabaseHealth() {
  return getDatabaseHealthFromStore();
}
