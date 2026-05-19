import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/paris-parfums-logo.png";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const clickState = useRef({ count: 0, timer: null });

  function handleSecretAccess() {
    clickState.current.count += 1;

    if (clickState.current.timer) {
      window.clearTimeout(clickState.current.timer);
    }

    clickState.current.timer = window.setTimeout(() => {
      clickState.current.count = 0;
    }, 1200);

    if (clickState.current.count >= 5) {
      clickState.current.count = 0;
      window.clearTimeout(clickState.current.timer);
      navigate("/acceso");
    }
  }

  return (
    <div className="site-shell">
      <div className="page-frame">
        <header className="topbar reveal-on-scroll" data-reveal>
          <Link
            to="/"
            className="logo-link"
            aria-label="Ir al inicio"
            onClick={handleSecretAccess}
          >
            <img className="logo" src={logo} alt="Paris Parfums" />
          </Link>
        </header>
        {children}
      </div>
    </div>
  );
}
