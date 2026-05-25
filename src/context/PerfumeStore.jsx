import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { ADMIN_INACTIVITY_TIMEOUT_MS } from "../config/security";
import { defaultPerfumes } from "../data/perfumes";
import Perfume from "../models/Perfume";
import {
  createPerfume,
  editPerfume,
  fetchPerfumes,
  removePerfume,
  restorePerfumes
} from "../services/perfumeApi";
import { ADMIN_LOGOUT_REASON_KEY } from "../utils/adminSecurity";

const SESSION_KEY = "paris-parfums-admin-session";
const LAST_ACTIVITY_KEY = "paris-parfums-admin-last-activity";
const ADMIN_PASSWORD_KEY = "paris-parfums-admin-password";

const PerfumeStoreContext = createContext(null);

// Provee el catalogo, la sesion admin y las operaciones de gestion a toda la app.
export function PerfumeStoreProvider({ children }) {
  const [perfumes, setPerfumes] = useState(() => Perfume.fromCollection(defaultPerfumes));
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isLoadingPerfumes, setIsLoadingPerfumes] = useState(true);
  const activityTimerRef = useRef(null);

  // Limpia la sesion admin y opcionalmente guarda el motivo del cierre.
  function clearAdminSession(reason = "") {
    window.sessionStorage.removeItem(SESSION_KEY);
    window.sessionStorage.removeItem(LAST_ACTIVITY_KEY);
    window.sessionStorage.removeItem(ADMIN_PASSWORD_KEY);

    if (reason) {
      window.sessionStorage.setItem(ADMIN_LOGOUT_REASON_KEY, reason);
    } else {
      window.sessionStorage.removeItem(ADMIN_LOGOUT_REASON_KEY);
    }

    setIsAdminAuthenticated(false);
  }

  useEffect(() => {
    const storedSession = window.sessionStorage.getItem(SESSION_KEY);
    const storedPassword = window.sessionStorage.getItem(ADMIN_PASSWORD_KEY);
    setIsAdminAuthenticated(storedSession === "true" && Boolean(storedPassword));
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadPerfumes() {
      try {
        const apiPerfumes = await fetchPerfumes();
        if (isMounted) {
          setPerfumes(Perfume.fromCollection(apiPerfumes));
        }
      } catch {
        if (isMounted) {
          setPerfumes(Perfume.fromCollection(defaultPerfumes));
        }
      } finally {
        if (isMounted) {
          setIsLoadingPerfumes(false);
        }
      }
    }

    loadPerfumes();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isAdminAuthenticated) {
      if (activityTimerRef.current) {
        window.clearInterval(activityTimerRef.current);
      }
      return undefined;
    }

    const markActivity = () => {
      window.sessionStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
    };

    const checkInactivity = () => {
      const lastActivity = Number(window.sessionStorage.getItem(LAST_ACTIVITY_KEY) || 0);
      if (lastActivity && Date.now() - lastActivity > ADMIN_INACTIVITY_TIMEOUT_MS) {
        clearAdminSession("La sesion se cerro por inactividad.");
      }
    };

    markActivity();

    const events = ["mousedown", "keydown", "touchstart", "scroll"];
    events.forEach((eventName) =>
      window.addEventListener(eventName, markActivity, { passive: true })
    );

    activityTimerRef.current = window.setInterval(checkInactivity, 30 * 1000);

    return () => {
      events.forEach((eventName) => window.removeEventListener(eventName, markActivity));
      if (activityTimerRef.current) {
        window.clearInterval(activityTimerRef.current);
      }
    };
  }, [isAdminAuthenticated]);

  const value = useMemo(() => {
    const featuredPerfume = perfumes[0] ?? defaultPerfumes[0];
    const adminPassword = window.sessionStorage.getItem(ADMIN_PASSWORD_KEY) || "";

    return {
      perfumes,
      featuredPerfume,
      isAdminAuthenticated,
      isLoadingPerfumes,
      getPerfumeBySlug: (slug) => perfumes.find((perfume) => perfume.slug === slug),
      addPerfume: async (input) => {
        const created = await createPerfume(input, adminPassword);
        const normalized = Perfume.fromApi(created);
        setPerfumes((current) => [...current, normalized]);
        return normalized;
      },
      updatePerfume: async (slug, input) => {
        const updated = await editPerfume(slug, input, adminPassword);
        const normalized = Perfume.fromApi(updated);
        setPerfumes((current) =>
          current.map((perfume) => (perfume.slug === slug ? normalized : perfume))
        );
        return normalized;
      },
      deletePerfume: async (slug) => {
        await removePerfume(slug, adminPassword);
        setPerfumes((current) => current.filter((perfume) => perfume.slug !== slug));
      },
      resetPerfumes: async () => {
        const nextPerfumes = await restorePerfumes(adminPassword);
        setPerfumes(Perfume.fromCollection(nextPerfumes));
      },
      loginAdmin: (password) => {
        window.sessionStorage.setItem(SESSION_KEY, "true");
        window.sessionStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
        window.sessionStorage.setItem(ADMIN_PASSWORD_KEY, password);
        window.sessionStorage.removeItem(ADMIN_LOGOUT_REASON_KEY);
        setIsAdminAuthenticated(true);
      },
      logoutAdmin: () => {
        clearAdminSession();
      }
    };
  }, [isAdminAuthenticated, isLoadingPerfumes, perfumes]);

  return (
    <PerfumeStoreContext.Provider value={value}>{children}</PerfumeStoreContext.Provider>
  );
}

// Devuelve el acceso tipico al contexto de perfumes y administracion.
export function usePerfumeStore() {
  const context = useContext(PerfumeStoreContext);

  if (!context) {
    throw new Error("usePerfumeStore must be used within PerfumeStoreProvider");
  }

  return context;
}
