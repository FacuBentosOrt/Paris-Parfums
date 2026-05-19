import Layout from "../components/Layout";
import ContactFooter from "../components/ContactFooter";
import PerfumeCard from "../components/PerfumeCard";
import PerfumeVisual from "../components/PerfumeVisual";
import { featuredPerfume, perfumes } from "../data/perfumes";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";

export default function HomePage() {
  useRevealOnScroll();

  return (
    <Layout>
      <section className="hero">
        <div className="content reveal-on-scroll" data-reveal>
          <p className="eyebrow">Fragancia destacada</p>
          <h1>
            {featuredPerfume.name} deja una estela intensa, elegante y dificil de olvidar.
          </h1>
          <p className="summary">
            {featuredPerfume.heroDescription} La idea de esta portada es que el texto principal
            cuente exactamente lo que transmite la fragancia que se ve a la derecha:
            profundidad, lujo y caracter.
          </p>
          <div className="footer-row">
            <a className="button light" href="#catalogo">
              Ver perfumes
            </a>
            <a
              className="button"
              href="https://wa.me/59800000000"
              target="_blank"
              rel="noreferrer"
            >
              Consultar por WhatsApp
            </a>
          </div>
        </div>

        <aside className="panel reveal-on-scroll" data-reveal>
          <PerfumeVisual label="PARIS" />
          <h2>{featuredPerfume.name}</h2>
          <p>{featuredPerfume.detailedDescription}</p>
          <div className="notes">
            {featuredPerfume.notes.map((note) => (
              <span key={note}>{note}</span>
            ))}
          </div>
        </aside>
      </section>

      <section className="catalog-section" id="catalogo">
        <div className="section-heading reveal-on-scroll" data-reveal>
          <h2>El catalogo aparece al bajar.</h2>
          <p>
            En lugar de separar la navegacion, esta version muestra la coleccion dentro de la
            misma pagina. Las tarjetas se van revelando con scroll para que la experiencia se
            sienta mas cuidada y con un poco mas de impacto visual.
          </p>
        </div>

        <div className="catalog-grid">
          {perfumes.map((perfume) => (
            <PerfumeCard key={perfume.slug} perfume={perfume} />
          ))}
        </div>
      </section>

      <ContactFooter />
    </Layout>
  );
}
