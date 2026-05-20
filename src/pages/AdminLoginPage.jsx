import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ADMIN_PASSWORD } from "../config/admin";
import Layout from "../components/Layout";
import { usePerfumeStore } from "../context/PerfumeStore";
import {
  ADMIN_LOGOUT_REASON_KEY,
  clearAdminAttempts,
  formatRemainingSeconds,
  getAdminLockState,
  recordFailedAdminAttempt
} from "../utils/adminSecurity";

// Renderiza el acceso privado del panel administrativo con control de intentos.
export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [remainingSeconds, setRemainingSeconds] = useState(
    formatRemainingSeconds(getAdminLockState().remainingMs)
  );
  const navigate = useNavigate();
  const { loginAdmin, isAdminAuthenticated } = usePerfumeStore();
  const lockState = getAdminLockState();

  useEffect(() => {
    const logoutReason = window.sessionStorage.getItem(ADMIN_LOGOUT_REASON_KEY);
    if (logoutReason) {
      setError(logoutReason);
      window.sessionStorage.removeItem(ADMIN_LOGOUT_REASON_KEY);
    }

    const timer = window.setInterval(() => {
      setRemainingSeconds(formatRemainingSeconds(getAdminLockState().remainingMs));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  if (isAdminAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  // Valida la clave admin y aplica el bloqueo temporal ante demasiados fallos.
  function handleSubmit(event) {
    event.preventDefault();
    const lockState = getAdminLockState();

    if (lockState.locked) {
      setError(
        `Demasiados intentos fallidos. Espera ${formatRemainingSeconds(lockState.remainingMs)} segundos.`
      );
      return;
    }

    if (password === ADMIN_PASSWORD) {
      clearAdminAttempts();
      loginAdmin();
      navigate("/admin");
      return;
    }

    const result = recordFailedAdminAttempt();

    if (result.locked) {
      setError(
        `Demasiados intentos fallidos. Espera ${formatRemainingSeconds(result.remainingMs)} segundos.`
      );
      return;
    }

    setError(
      `Clave incorrecta. Te quedan ${result.attemptsLeft} intento${
        result.attemptsLeft === 1 ? "" : "s"
      }.`
    );
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
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (error && !lockState.locked) {
                    setError("");
                  }
                }}
                placeholder="Ingresar clave"
                autoComplete="current-password"
                disabled={lockState.locked}
              />
            </label>
            {error ? <p className="admin-error">{error}</p> : null}
            <button
              className="button light admin-submit"
              type="submit"
              disabled={lockState.locked}
            >
              {lockState.locked ? `Reintentar en ${remainingSeconds}s` : "Entrar"}
            </button>
          </form>
        </div>
      </section>
    </Layout>
  );
}
