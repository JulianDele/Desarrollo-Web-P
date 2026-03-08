import { Navigate } from "react-router-dom";
import { hasSession } from "../auth/session";

export default function ProtectedRoute({ children, redirectTo = "/login" }) {
  if (!hasSession()) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}
