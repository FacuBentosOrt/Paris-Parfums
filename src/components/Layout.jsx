import { useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/paris-parfums-logo.svg";

const secretClickState = {
  count: 0,
  timer: null
};

// Envuelve cada pagina con la cabecera del logo y la estructura visual comun.
export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const clickState = useRef(secretClickState);
  const disableLogoNavigation =
    location.pathname.startsWith("/admin") || location.pathname.startsWith("/acceso");

  // Habilita el acceso oculto al login admin con varios clicks rapidos en el logo.
  function handleSecretAccess(event) {
    clickState.current.count += 1;

    if (clickState.current.timer) {
      window.clearTimeout(clickState.current.timer);
    }

    clickState.current.timer = window.setTimeout(() => {
      clickState.current.count = 0;
    }, 1200);

    if (clickState.current.count >= 5) {
      event.preventDefault();
      clickState.current.count = 0;
      window.clearTimeout(clickState.current.timer);
      clickState.current.timer = null;
      navigate("/acceso");
    }
  }

  return (
    <div className="site-shell">
      <div className="page-frame">
        <header className="topbar reveal-on-scroll" data-reveal>
          {disableLogoNavigation ? (
            <div className="logo-link logo-static" aria-label="Paris Parfums">
              <img className="logo" src={logo} alt="Paris Parfums" />
            </div>
          ) : (
            <Link
              to="/"
              className="logo-link"
              aria-label="Ir al inicio"
              onClick={handleSecretAccess}
            >
              <img className="logo" src={logo} alt="Paris Parfums" />
            </Link>
          )}
        </header>
        {children}
      </div>
    </div>
  );
}
