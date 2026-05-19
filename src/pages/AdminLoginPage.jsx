import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ADMIN_PASSWORD } from "../config/admin";
import Layout from "../components/Layout";
import { usePerfumeStore } from "../context/PerfumeStore";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { loginAdmin, isAdminAuthenticated } = usePerfumeStore();

  if (isAdminAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (password === ADMIN_PASSWORD) {
      loginAdmin();
      navigate("/admin");
      return;
    }

    setError("Clave incorrecta.");
  }

  return (
    <Layout>
      <section className="auth-section">
        <div className="auth-card reveal-on-scroll visible">
          <p className="eyebrow">Acceso privado</p>
          <h1>Ingreso de administrador</h1>
          <p className="summary">
            Este acceso esta pensado para el duenio del sitio. Desde aca puede entrar al panel
            y modificar el catalogo.
          </p>
          <form className="admin-form" onSubmit={handleSubmit}>
            <label className="field">
              <span>Clave</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Ingresar clave"
              />
            </label>
            {error ? <p className="admin-error">{error}</p> : null}
            <button className="button light admin-submit" type="submit">
              Entrar
            </button>
          </form>
        </div>
      </section>
    </Layout>
  );
}
