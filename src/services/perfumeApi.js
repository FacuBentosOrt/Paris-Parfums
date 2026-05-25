const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

function joinUrl(pathname) {
  return `${API_BASE_URL}${pathname}`;
}

async function request(pathname, options = {}) {
  const response = await fetch(joinUrl(pathname), options);

  if (!response.ok) {
    let errorMessage = `Error ${response.status}`;
    try {
      const payload = await response.json();
      if (payload?.error) {
        errorMessage = payload.error;
      }
    } catch {
      // Keep fallback error message.
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function fetchPerfumes() {
  return request("/api/perfumes");
}

export function createPerfume(perfume, adminPassword) {
  return request("/api/perfumes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-password": adminPassword
    },
    body: JSON.stringify(perfume)
  });
}

export function editPerfume(slug, perfume, adminPassword) {
  return request(`/api/perfumes/${slug}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-admin-password": adminPassword
    },
    body: JSON.stringify(perfume)
  });
}

export function removePerfume(slug, adminPassword) {
  return request(`/api/perfumes/${slug}`, {
    method: "DELETE",
    headers: {
      "x-admin-password": adminPassword
    }
  });
}

export function restorePerfumes(adminPassword) {
  return request("/api/perfumes/reset", {
    method: "POST",
    headers: {
      "x-admin-password": adminPassword
    }
  });
}
