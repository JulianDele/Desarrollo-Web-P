import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  listenLogout,
  fetchWithAuth,
  clearSession,
  isSessionExpired,
} from "../auth/session";

/**
 * ProtectedRoute — guarda de autenticación.
 *
 * Flujo:
 *  1. Si el token expiró localmente → limpia y redirige con ?reason=expired
 *  2. Verifica con backend vía fetchWithAuth (maneja refresh automático)
 *  3. 401 del servidor → sesión expirada → redirige con ?reason=expired
 *  4. Otro error      → redirige con ?reason=error
 *  5. OK              → renderiza children
 */
function ProtectedRoute({ children }) {

  const [authStatus, setAuthStatus] = useState("checking"); // checking | ok | expired | error

  useEffect(() => {

    const checkSession = async () => {

      // Cortocircuito local: token ya expiró
      if (isSessionExpired()) {
        clearSession();
        setAuthStatus("expired");
        return;
      }

      try {

        const res = await fetchWithAuth("/api/session");

        if (res.ok) {
          setAuthStatus("ok");
        } else if (res.status === 401) {
          clearSession();
          setAuthStatus("expired");
        } else {
          setAuthStatus("error");
        }

      } catch {
        setAuthStatus("error");
      }

    };

    checkSession();

    // Escuchar logout desde otras pestañas
    const stopListening = listenLogout(() => {
      window.location.href = "/login?reason=expired";
    });

    return () => {
      stopListening();
    };

  }, []);

  if (authStatus === "checking") {
    return (
      <div className="auth-checking" role="status" aria-live="polite">
        <p>Cargando sesión...</p>
      </div>
    );
  }

  if (authStatus === "expired") {
    return <Navigate to="/login?reason=expired" replace />;
  }

  if (authStatus === "error") {
    return <Navigate to="/login?reason=error" replace />;
  }

  return children;
}

export default ProtectedRoute;