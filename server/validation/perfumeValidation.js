import { FIELD_LIMITS, PRICE_LIMITS } from "../config/perfumeLimits.js";
import { slugify } from "../utils/slugify.js";

function sanitizeText(value, maxLength) {
  return String(value ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function sanitizeList(value) {
  return String(value ?? "")
    .split(",")
    .map((item) => sanitizeText(item, FIELD_LIMITS.listItem))
    .filter(Boolean)
    .slice(0, FIELD_LIMITS.listCount);
}

function normalizeList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item ?? "")).join(", ");
  }

  return value;
}

function validateImageUrl(url) {
  if (!url) {
    return "";
  }

  const trimmed = String(url).trim();
  const allowedDataUrl = /^data:image\/(png|jpeg|jpg|webp);base64,/i;
  if (allowedDataUrl.test(trimmed)) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "https:") {
      return trimmed;
    }
  } catch {
    // Falls through to error.
  }

  throw new Error(
    "La imagen por URL debe usar https o ser una imagen cargada desde el formulario."
  );
}

export function validateAndNormalizePerfumeInput(input) {
  const name = sanitizeText(input.name, FIELD_LIMITS.name);
  if (!name) {
    throw new Error("El nombre del perfume es obligatorio.");
  }

  const price = Number(input.price);
  if (!Number.isFinite(price) || price < PRICE_LIMITS.min || price > PRICE_LIMITS.max) {
    throw new Error("El precio debe ser un numero valido entre 0 y 10000.");
  }

  const notes = sanitizeList(normalizeList(input.notes));
  if (notes.length === 0) {
    throw new Error("Ingresa al menos una nota del perfume.");
  }

  const occasions = sanitizeList(normalizeList(input.occasions));
  if (occasions.length === 0) {
    throw new Error("Ingresa al menos una ocasion o momento de uso.");
  }

  const shortDescription = sanitizeText(
    input.shortDescription,
    FIELD_LIMITS.shortDescription
  );
  const heroDescription = sanitizeText(
    input.heroDescription,
    FIELD_LIMITS.heroDescription
  );
  const detailedDescription = sanitizeText(
    input.detailedDescription,
    FIELD_LIMITS.detailedDescription
  );
  const narrative = sanitizeText(input.narrative, FIELD_LIMITS.narrative);

  if (!shortDescription || !heroDescription || !detailedDescription || !narrative) {
    throw new Error("Completa todas las descripciones del perfume.");
  }

  return {
    slug: slugify(sanitizeText(input.slug || name, FIELD_LIMITS.slug) || name),
    name,
    imageUrl: validateImageUrl(String(input.imageUrl ?? "")),
    price: Math.round(price),
    family: sanitizeText(input.family, FIELD_LIMITS.family),
    shortDescription,
    heroDescription,
    detailedDescription,
    narrative,
    volume: sanitizeText(input.volume, FIELD_LIMITS.volume),
    concentration: sanitizeText(input.concentration, FIELD_LIMITS.concentration),
    badge: sanitizeText(input.badge, FIELD_LIMITS.badge),
    notes,
    occasions,
    intensity: sanitizeText(input.intensity, FIELD_LIMITS.intensity),
    duration: sanitizeText(input.duration, FIELD_LIMITS.duration)
  };
}
