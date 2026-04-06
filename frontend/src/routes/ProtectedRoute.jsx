import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { listenLogout, fetchWithAuth, clearSession, isSessionExpired } from "../auth/session";

function ProtectedRoute({ children }) {
  const [isValid, setIsValid] = useState(null);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      if (isSessionExpired()) {
        clearSession();
        setSessionExpired(true);
        setIsValid(false);
        return;
      }

      try {
        const res = await fetchWithAuth("/api/session");

        if (res.ok) {
          setIsValid(true);
        } else if (res.status === 401) {
          setSessionExpired(true);
          setIsValid(false);
          clearSession();
        } else {
          setIsValid(false);
        }
      } catch {
        setIsValid(false);
      }
    };

    checkSession();

    const stopListening = listenLogout(() => {
      window.location.href = "/login";
    });

    return () => stopListening();
  }, []);

  if (isValid === null) {
    return (
      <p role="status" aria-live="polite">
        Cargando sesión...
      </p>
    );
  }

  if (sessionExpired) {
    return (
      <div>
        <p role="alert">Tu sesión ha expirado</p>
        <Navigate to="/login" />
      </div>
    );
  }

  if (!isValid) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;
