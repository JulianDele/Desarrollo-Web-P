import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { fetchWithAuth, getDefaultRouteByRole, getSession, normalizeRole } from "../auth/session";

export default function RoleRoute({ children, allowedRoles = [], redirectTo }) {
  const navigate = useNavigate();
  const { token } = getSession();

  const normalizedAllowedRoles = useMemo(
    () => allowedRoles.map((allowedRole) => normalizeRole(allowedRole)),
    [allowedRoles]
  );

  const [status, setStatus] = useState("checking"); // checking | allowed | forbidden | unauth
  const [serverRole, setServerRole] = useState("guest");

  useEffect(() => {
    const checkRole = async () => {
      if (!token) {
        setStatus("unauth");
        return;
      }

      try {
        const res = await fetchWithAuth("/api/session");
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          setStatus("unauth");
          return;
        }

        const role = normalizeRole(data?.user?.role);
        setServerRole(role);

        if (normalizedAllowedRoles.includes(role)) {
          setStatus("allowed");
        } else {
          setStatus("forbidden");
        }
      } catch {
        setStatus("unauth");
      }
    };

    checkRole();
  }, [token, normalizedAllowedRoles]);

  if (status === "checking") {
    return (
      <p role="status" aria-live="polite">
        Verificando permisos...
      </p>
    );
  }

  if (status === "unauth") {
    return <Navigate to="/login" replace />;
  }

  if (status === "forbidden") {
    const fallbackRoute = redirectTo || getDefaultRouteByRole(serverRole);

    return (
      <div role="alert" aria-live="assertive">
        <p>No tienes permisos para acceder a esta sección.</p>
        <button type="button" onClick={() => navigate(fallbackRoute, { replace: true })}>
          Volver
        </button>
      </div>
    );
  }

  return children;
}
