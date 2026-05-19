import PerfumeVisual from "./PerfumeVisual";

export default function PerfumeMedia({ perfume, size = "default" }) {
  if (perfume?.imageUrl) {
    const className =
      size === "large" ? "perfume-image perfume-image-large" : "perfume-image";

    return <img className={className} src={perfume.imageUrl} alt={perfume.name} />;
  }

  return <PerfumeVisual size={size} label="PARIS" />;
}
