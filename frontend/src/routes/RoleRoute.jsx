import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getDefaultRouteByRole,
  getSession,
  normalizeRole,
  fetchWithAuth,
  clearSession,
  isSessionExpired,
} from "../auth/session";


export default function RoleRoute({ children, allowedRoles = [], redirectTo }) {

  // Estados posibles: checking | authorized | expired | forbidden | error
  const [authStatus, setAuthStatus] = useState("checking");

  useEffect(() => {
    const verify = async () => {
      const { token, role } = getSession();

      // 1. Sin token local → no hay sesión
      if (!token) {
        setAuthStatus("expired");
        return;
      }

      // 2. Token expirado localmente → no gastar fetch
      if (isSessionExpired()) {
        clearSession();
        setAuthStatus("expired");
        return;
      }

      // 3. Verificar con el backend
      try {
        const res = await fetchWithAuth("/api/session");

        if (res.status === 401) {
          clearSession();
          setAuthStatus("expired");
          return;
        }

        if (!res.ok) {
          setAuthStatus("error");
          return;
        }

        // 4. Verificar rol contra los permitidos
        const normalizedAllowed = allowedRoles.map(normalizeRole);
        const normalizedRole = normalizeRole(role);

        if (!normalizedAllowed.includes(normalizedRole)) {
          setAuthStatus("forbidden");
          return;
        }

        setAuthStatus("authorized");

      } catch {
        // Error de red
        setAuthStatus("error");
      }
    };

    verify();
  }, [allowedRoles]);

  const { role } = getSession();

  if (authStatus === "checking") {
    return (
      <div className="auth-checking" role="status" aria-live="polite">
        <p>Verificando acceso...</p>
      </div>
    );
  }

  if (authStatus === "expired") {
    return <Navigate to="/login?reason=expired" replace />;
  }

  if (authStatus === "forbidden") {
    const fallback = redirectTo || getDefaultRouteByRole(role);
    return <Navigate to={`${fallback}?reason=forbidden`} replace />;
  }

  if (authStatus === "error") {
    return <Navigate to="/login?reason=error" replace />;
  }

  return children;
}