export default function ContactFooter() {
  return (
    <footer className="footer reveal-on-scroll" data-reveal>
      <div className="contact-block">
        <span className="contact-label">Contacto por WhatsApp</span>
        <span className="contact-phone">+598 00 000 000</span>
      </div>
      <a
        className="whatsapp-link"
        href="https://wa.me/59800000000"
        target="_blank"
        rel="noreferrer"
      >
        Ir al chat
      </a>
    </footer>
  );
}
