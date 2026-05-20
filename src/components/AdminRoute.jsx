import { Navigate } from "react-router-dom";
import { usePerfumeStore } from "../context/PerfumeStore";

// Protege una ruta para que solo sea visible con una sesion admin activa.
export default function AdminRoute({ children }) {
  const { isAdminAuthenticated } = usePerfumeStore();

  if (!isAdminAuthenticated) {
    return <Navigate to="/acceso" replace />;
  }

  return children;
}
