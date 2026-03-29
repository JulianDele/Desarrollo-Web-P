const TOKEN_KEY = "accessToken";
const ROLE_KEY = "role";
const SESSION_ID_KEY = "sessionId";
const EXPIRES_KEY = "expiresAt";

const ROLE_ALIASES = {
  admin: "admin",
  administrador: "admin",
  recepcionista: "recepcionista",
  receptionist: "recepcionista",
  cliente: "cliente",
  client: "cliente",
  usuario: "cliente",
  user: "cliente",
  invitado: "guest",
  guest: "guest",
};

// Normalizar roles
export function normalizeRole(role) {
  if (!role || typeof role !== "string") {
    return "guest";
  }

  const normalized = role.trim().toLowerCase();
  return ROLE_ALIASES[normalized] || "guest";
}

// Obtener sesión completa
export function getSession() {
  return {
    token: localStorage.getItem(TOKEN_KEY) || "",
    role: normalizeRole(
      localStorage.getItem(ROLE_KEY)
    ),
    sessionId: localStorage.getItem(SESSION_ID_KEY),
    expiresAt: localStorage.getItem(EXPIRES_KEY),
  };
}

// Guardar sesión completa
export function setSession({
  accessToken,
  role,
  sessionId,
  expiresAt,
}) {
  if (accessToken) {
    localStorage.setItem(TOKEN_KEY, accessToken);
  }

  if (sessionId) {
    localStorage.setItem(SESSION_ID_KEY, sessionId);
  }

  if (role) {
    localStorage.setItem(ROLE_KEY, normalizeRole(role));
  }

  if (expiresAt) {
    localStorage.setItem(EXPIRES_KEY, expiresAt);
  }
}

// Limpiar sesión
export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(SESSION_ID_KEY);
  localStorage.removeItem(EXPIRES_KEY);

  notifyLogout();
}

// Verificar si existe sesión
export function hasSession() {
  return Boolean(localStorage.getItem(TOKEN_KEY));
}

// Rutas por rol
export function getDefaultRouteByRole(role) {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === "admin") {
    return "/admin/dashboard";
  }

  if (
    normalizedRole === "recepcionista" ||
    normalizedRole === "cliente"
  ) {
    return "/dashboard";
  }

  return "/";
}

export function notifyLogout() {
  localStorage.setItem("logout-event", Date.now());
}

export function listenLogout(callback) {
  const handler = (event) => {
    if (event.key === "logout-event") {
      callback();
    }
  };

  window.addEventListener("storage", handler);

  return () => {
    window.removeEventListener("storage", handler);
  };
}

export function getSessionExpiry() {
  return localStorage.getItem(EXPIRES_KEY);
}

export function isSessionExpired() {
  const expiresAt = getSessionExpiry();

  if (!expiresAt) return true;

  return new Date().getTime() > new Date(expiresAt).getTime();
}

export async function fetchWithAuth(url, options = {}) {
  let token = localStorage.getItem(TOKEN_KEY);

  let response = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  // Si sesión expiró, intentar refresh
  if (response.status === 401) {
    const refreshRes = await fetch("/api/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (refreshRes.ok) {
      const data = await refreshRes.json();

      if (data.accessToken) {
        localStorage.setItem(TOKEN_KEY, data.accessToken);
        token = data.accessToken;
      }

      // Reintentar request original
      response = await fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
    } else {
      clearSession();
      window.location.href = "/login";
    }
  }

  return response;
}