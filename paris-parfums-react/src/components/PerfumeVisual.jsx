export default function PerfumeVisual({ size = "default", label = "PARIS" }) {
  const className =
    size === "large" ? "perfume-bottle perfume-bottle-large" : "perfume-bottle";

  return <div className={className} aria-hidden="true" data-label={label} />;
}
