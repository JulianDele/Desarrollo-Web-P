import { Navigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import {
  clearSession,
  fetchWithAuth,
  getDefaultRouteByRole,
  getSession,
  isSessionExpired,
  normalizeRole,
} from "../auth/session";

/**
 * RoleRoute — guarda por rol.
 * - No confía en el rol guardado en localStorage (puede ser manipulado).
 * - Consulta al backend (/api/session) antes de autorizar.
 */
export default function RoleRoute({ children, allowedRoles = [], redirectTo }) {
  const normalizedAllowed = useMemo(
    () => allowedRoles.map((role) => normalizeRole(role)),
    [allowedRoles]
  );

  const [authStatus, setAuthStatus] = useState("checking"); // checking | authorized | expired | forbidden | error
  const [serverRole, setServerRole] = useState("guest");

  useEffect(() => {
    const verify = async () => {
      const { token } = getSession();

      if (!token) {
        setAuthStatus("expired");
        return;
      }

      if (isSessionExpired()) {
        clearSession();
        setAuthStatus("expired");
        return;
      }

      try {
        const res = await fetchWithAuth("/api/session");
        const data = await res.json().catch(() => ({}));

        if (res.status === 401) {
          clearSession();
          setAuthStatus("expired");
          return;
        }

        if (!res.ok) {
          setAuthStatus("error");
          return;
        }

        const role = normalizeRole(data?.user?.role);
        setServerRole(role);

        if (!normalizedAllowed.includes(role)) {
          setAuthStatus("forbidden");
          return;
        }

        setAuthStatus("authorized");
      } catch {
        setAuthStatus("error");
      }
    };

    verify();
  }, [normalizedAllowed]);

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
    const fallback = redirectTo || getDefaultRouteByRole(serverRole);
    return <Navigate to={`${fallback}?reason=forbidden`} replace />;
  }

  if (authStatus === "error") {
    return <Navigate to="/login?reason=error" replace />;
  }

  return children;
}

