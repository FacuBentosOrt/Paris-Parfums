import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { defaultPerfumes } from "../data/perfumes";
import { slugify } from "../utils/slugify";

const PERFUMES_KEY = "paris-parfums-perfumes";
const SESSION_KEY = "paris-parfums-admin-session";

const PerfumeStoreContext = createContext(null);

function normalizePerfume(input) {
  const slug = slugify(input.slug || input.name);

  return {
    slug,
    name: input.name.trim(),
    imageUrl: input.imageUrl?.trim() || "",
    family: input.family.trim(),
    shortDescription: input.shortDescription.trim(),
    heroDescription: input.heroDescription.trim(),
    detailedDescription: input.detailedDescription.trim(),
    narrative: input.narrative.trim(),
    volume: input.volume.trim(),
    concentration: input.concentration.trim(),
    badge: input.badge.trim(),
    notes: input.notes
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    occasions: input.occasions
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    intensity: input.intensity.trim(),
    duration: input.duration.trim()
  };
}

export function PerfumeStoreProvider({ children }) {
  const [perfumes, setPerfumes] = useState(defaultPerfumes);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    const storedPerfumes = window.localStorage.getItem(PERFUMES_KEY);
    const storedSession = window.sessionStorage.getItem(SESSION_KEY);

    if (storedPerfumes) {
      try {
        setPerfumes(JSON.parse(storedPerfumes));
      } catch {
        setPerfumes(defaultPerfumes);
      }
    }

    setIsAdminAuthenticated(storedSession === "true");
  }, []);

  useEffect(() => {
    window.localStorage.setItem(PERFUMES_KEY, JSON.stringify(perfumes));
  }, [perfumes]);

  const value = useMemo(() => {
    const featuredPerfume = perfumes[0] ?? defaultPerfumes[0];

    return {
      perfumes,
      featuredPerfume,
      isAdminAuthenticated,
      getPerfumeBySlug: (slug) => perfumes.find((perfume) => perfume.slug === slug),
      addPerfume: (input) => {
        const normalized = normalizePerfume(input);
        setPerfumes((current) => [...current, normalized]);
        return normalized;
      },
      updatePerfume: (slug, input) => {
        const normalized = normalizePerfume(input);
        setPerfumes((current) =>
          current.map((perfume) => (perfume.slug === slug ? normalized : perfume))
        );
        return normalized;
      },
      deletePerfume: (slug) => {
        setPerfumes((current) => current.filter((perfume) => perfume.slug !== slug));
      },
      resetPerfumes: () => {
        setPerfumes(defaultPerfumes);
      },
      loginAdmin: () => {
        window.sessionStorage.setItem(SESSION_KEY, "true");
        setIsAdminAuthenticated(true);
      },
      logoutAdmin: () => {
        window.sessionStorage.removeItem(SESSION_KEY);
        setIsAdminAuthenticated(false);
      }
    };
  }, [isAdminAuthenticated, perfumes]);

  return (
    <PerfumeStoreContext.Provider value={value}>{children}</PerfumeStoreContext.Provider>
  );
}

export function usePerfumeStore() {
  const context = useContext(PerfumeStoreContext);

  if (!context) {
    throw new Error("usePerfumeStore must be used within PerfumeStoreProvider");
  }

  return context;
}
