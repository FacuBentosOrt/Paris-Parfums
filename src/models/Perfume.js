export default class Perfume {
  constructor(input = {}) {
    this.slug = String(input.slug ?? "");
    this.name = String(input.name ?? "");
    this.imageUrl = String(input.imageUrl ?? "");
    this.price = Number.isFinite(Number(input.price)) ? Number(input.price) : 0;
    this.family = String(input.family ?? "");
    this.shortDescription = String(input.shortDescription ?? "");
    this.heroDescription = String(input.heroDescription ?? "");
    this.detailedDescription = String(input.detailedDescription ?? "");
    this.narrative = String(input.narrative ?? "");
    this.volume = String(input.volume ?? "");
    this.concentration = String(input.concentration ?? "");
    this.badge = String(input.badge ?? "");
    this.notes = Perfume.#normalizeStringList(input.notes);
    this.occasions = Perfume.#normalizeStringList(input.occasions);
    this.intensity = String(input.intensity ?? "");
    this.duration = String(input.duration ?? "");
  }

  static fromApi(raw) {
    return new Perfume(raw);
  }

  static fromCollection(items) {
    if (!Array.isArray(items)) {
      return [];
    }

    return items.map((item) => Perfume.fromApi(item));
  }

  toApiPayload() {
    return {
      slug: this.slug,
      name: this.name,
      imageUrl: this.imageUrl,
      price: this.price,
      family: this.family,
      shortDescription: this.shortDescription,
      heroDescription: this.heroDescription,
      detailedDescription: this.detailedDescription,
      narrative: this.narrative,
      volume: this.volume,
      concentration: this.concentration,
      badge: this.badge,
      notes: this.notes,
      occasions: this.occasions,
      intensity: this.intensity,
      duration: this.duration
    };
  }

  static #normalizeStringList(value) {
    if (Array.isArray(value)) {
      return value.map((item) => String(item ?? "").trim()).filter(Boolean);
    }

    return String(value ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
}
