import logo from "../assets/paris-parfums-logo.png";

export default function Layout({ children }) {
  return (
    <div className="site-shell">
      <div className="page-frame">
        <header className="topbar reveal-on-scroll" data-reveal>
          <img className="logo" src={logo} alt="Paris Parfums" />
        </header>
        {children}
      </div>
    </div>
  );
}
