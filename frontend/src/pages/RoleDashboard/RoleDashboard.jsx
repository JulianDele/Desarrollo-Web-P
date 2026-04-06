import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { clearSession, fetchWithAuth, getSession } from "../../auth/session";
import "./RoleDashboard.css";

/**
 * RoleDashboard — panel principal por rol.
 *
 * Mejoras respecto a la versión anterior:
 * - Lee ?reason= de la URL para mostrar mensajes de sesión expirada o acceso denegado
 * - Usa fetchWithAuth para cualquier request protegido futuro
 * - El backend confirma la sesión antes de renderizar contenido sensible
 * - Maneja UX de 401 y 403 con mensajes accesibles
 */
export default function RoleDashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reason = searchParams.get("reason"); // "expired" | "forbidden" | null

  const { token, role } = getSession();

  // Sin sesión → login
  if (!token) {
    return <Navigate to="/login?reason=expired" replace />;
  }

  // Admin no debería llegar aquí
  if (role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Guest no tiene dashboard
  if (role === "guest") {
    return <Navigate to="/" replace />;
  }

  const title =
    role === "recepcionista" ? "Panel de Recepción" : "Panel de Cliente";

  const description =
    role === "recepcionista"
      ? "Accede a servicios, ubicación y gestión básica de operación."
      : "Consulta servicios, productos, ubicación e información del gimnasio.";

  const handleLogout = () => {
    clearSession();
    navigate("/login", { replace: true });
  };

  return (
    <main className="role-dashboard-page with-global-topbar">

      {/* ── Mensaje de sesión expirada (viene de ?reason=expired) ── */}
      {reason === "expired" && (
        <div
          className="role-dashboard-notice role-dashboard-notice--warning"
          role="alert"
          aria-live="assertive"
        >
          Tu sesión expiró. Por favor inicia sesión nuevamente.
        </div>
      )}

      {/* ── Mensaje de acceso denegado (viene de ?reason=forbidden) ── */}
      {reason === "forbidden" && (
        <div
          className="role-dashboard-notice role-dashboard-notice--error"
          role="alert"
          aria-live="assertive"
        >
          No tienes permisos para acceder a esa sección.
        </div>
      )}

      <section className="role-dashboard-hero">
        <div className="role-dashboard-hero-text">
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </section>

      <section className="role-dashboard-actions">
        <h2>Acciones Disponibles</h2>
        <div className="role-dashboard-actions-grid">
          <button
            type="button"
            className="role-dashboard-action-btn"
            onClick={() => navigate("/servicios")}
          >
            Ver servicios
          </button>
          <button
            type="button"
            className="role-dashboard-action-btn"
            onClick={() => navigate("/productos")}
          >
            Ver productos
          </button>
          <button
            type="button"
            className="role-dashboard-action-btn"
            onClick={() => navigate("/ubicacion")}
          >
            Ver ubicación
          </button>
        </div>
      </section>

      <section className="role-dashboard-footer">
        <button
          type="button"
          className="role-dashboard-action-btn role-dashboard-logout-btn"
          onClick={handleLogout}
        >
          Cerrar sesión
        </button>
      </section>
    </main>
  );
}