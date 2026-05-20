import PerfumeVisual from "./PerfumeVisual";

// Decide si mostrar una imagen real del perfume o el placeholder visual por defecto.
export default function PerfumeMedia({ perfume, size = "default" }) {
  if (perfume?.imageUrl) {
    const className =
      size === "large" ? "perfume-image perfume-image-large" : "perfume-image";

    return <img className={className} src={perfume.imageUrl} alt={perfume.name} />;
  }

  return <PerfumeVisual size={size} label="PARIS" />;
}
