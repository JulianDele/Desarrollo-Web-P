const TOKEN_KEY = "token";
const ROLE_KEY = "role";

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
  const token = localStorage.getItem(TOKEN_KEY) || "";
  const role = normalizeRole(localStorage.getItem(ROLE_KEY));

  return { token, role };
}

export function setSession({ token, role }) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  localStorage.setItem(ROLE_KEY, normalizeRole(role));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
}

export function hasSession() {
  return Boolean(localStorage.getItem(TOKEN_KEY));
}

export function getDefaultRouteByRole(role) {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === "admin") {
    return "/admin/dashboard";
  }

  if (normalizedRole === "recepcionista" || normalizedRole === "cliente") {
    return "/dashboard";
  }

  return "/";
}
