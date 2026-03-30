const TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
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

export function normalizeRole(role) {
  if (!role || typeof role !== "string") {
    return "guest";
  }

  const normalized = role.trim().toLowerCase();
  return ROLE_ALIASES[normalized] || "guest";
}

export function getSession() {
  return {
    token: localStorage.getItem(TOKEN_KEY) || "",
    refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY) || "",
    role: normalizeRole(localStorage.getItem(ROLE_KEY)),
    sessionId: localStorage.getItem(SESSION_ID_KEY),
    expiresAt: localStorage.getItem(EXPIRES_KEY),
  };
}

export function setSession({ accessToken, refreshToken, role, sessionId, expiresAt }) {
  if (accessToken) {
    localStorage.setItem(TOKEN_KEY, accessToken);
  }

  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
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

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(SESSION_ID_KEY);
  localStorage.removeItem(EXPIRES_KEY);
  notifyLogout();
}

export function hasSession() {
  return Boolean(localStorage.getItem(TOKEN_KEY));
}

export function getDefaultRouteByRole(role) {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === "admin") return "/admin/dashboard";
  if (normalizedRole === "recepcionista" || normalizedRole === "cliente") return "/dashboard";
  return "/";
}

export function notifyLogout() {
  localStorage.setItem("logout-event", Date.now());
}

export function listenLogout(callback) {
  const handler = (event) => {
    if (event.key === "logout-event") callback();
  };

  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}

export function getSessionExpiry() {
  return localStorage.getItem(EXPIRES_KEY);
}

export function isSessionExpired() {
  const expiresAt = getSessionExpiry();
  if (!expiresAt) return false;
  return new Date().getTime() > new Date(expiresAt).getTime();
}

export async function fetchWithAuth(url, options = {}) {
  let token = localStorage.getItem(TOKEN_KEY);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

  let response = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  if (response.status === 401) {
    const refreshRes = await fetch("/api/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ refreshToken }),
    });

    if (refreshRes.ok) {
      const data = await refreshRes.json().catch(() => ({}));
      if (data.accessToken) {
        localStorage.setItem(TOKEN_KEY, data.accessToken);
        token = data.accessToken;
      }

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
