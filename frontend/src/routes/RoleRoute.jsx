import { Navigate } from "react-router-dom";
import { getDefaultRouteByRole, getSession, normalizeRole } from "../auth/session";

export default function RoleRoute({ children, allowedRoles = [], redirectTo }) {
  const { token, role } = getSession();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const normalizedAllowedRoles = allowedRoles.map((allowedRole) => normalizeRole(allowedRole));

  if (!normalizedAllowedRoles.includes(role)) {
    const fallbackRoute = redirectTo || getDefaultRouteByRole(role);
    return <Navigate to={fallbackRoute} replace />;
  }

  return children;
}
