import { Navigate } from "react-router-dom";
import { usePerfumeStore } from "../context/PerfumeStore";

export default function AdminRoute({ children }) {
  const { isAdminAuthenticated } = usePerfumeStore();

  if (!isAdminAuthenticated) {
    return <Navigate to="/acceso" replace />;
  }

  return children;
}
