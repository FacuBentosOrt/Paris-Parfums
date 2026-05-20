// Normaliza texto para comparaciones flexibles dentro del buscador.
export function normalizeText(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

// Formatea precios del catalogo con moneda y notacion local.
export function formatPrice(value) {
  return new Intl.NumberFormat("es-UY", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}
