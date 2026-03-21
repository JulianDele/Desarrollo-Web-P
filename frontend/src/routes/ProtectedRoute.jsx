import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  listenLogout,
  fetchWithAuth,
  clearSession
} from "../auth/session";

function ProtectedRoute({ children }) {

  const [isValid, setIsValid] = useState(null);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {

    const checkSession = async () => {

      try {

        // Usar fetchWithAuth (maneja refresh automático)
        const res =
          await fetchWithAuth("/api/session");

        if (res.ok) {

          setIsValid(true);

        } else if (res.status === 401) {

          // sesión expirada
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

    // Escuchar logout desde otras pestañas
    const stopListening =
      listenLogout(() => {

        window.location.href =
          "/login";

      });

    return () => {

      stopListening();

    };

  }, []);

  if (isValid === null) {

    return <p>Cargando sesión...</p>;

  }

  if (sessionExpired) {

    return (
      <div>
        <p>Tu sesión ha expirado</p>
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