import { Link } from "react-router-dom";
import PerfumeVisual from "./PerfumeVisual";

export default function PerfumeCard({ perfume }) {
  return (
    <Link
      to={`/perfumes/${perfume.slug}`}
      className="catalog-card reveal-on-scroll"
      data-reveal
    >
      <PerfumeVisual />
      <h3>{perfume.name}</h3>
      <div className="family">{perfume.family}</div>
      <p>{perfume.shortDescription}</p>
      <div className="meta">
        <span>{perfume.volume}</span>
        <span>{perfume.concentration}</span>
        <span>{perfume.badge}</span>
      </div>
    </Link>
  );
}
