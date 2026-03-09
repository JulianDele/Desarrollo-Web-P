import { Navigate, useNavigate } from "react-router-dom";
import { clearSession, getSession } from "../../auth/session";
import "./RoleDashboard.css";

export default function RoleDashboard() {
  const navigate = useNavigate();
  const { token, role } = getSession();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (role === "guest") {
    return <Navigate to="/" replace />;
  }

  const title = role === "recepcionista" ? "Panel de Recepción" : "Panel de Cliente";
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
      <section className="role-dashboard-hero">
        <div className="role-dashboard-hero-text">
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </section>

      <section className="role-dashboard-actions">
        <h2>Acciones Disponibles</h2>
        <div className="role-dashboard-actions-grid">
          <button type="button" className="role-dashboard-action-btn" onClick={() => navigate("/servicios")}>
            Ver servicios
          </button>
          <button type="button" className="role-dashboard-action-btn" onClick={() => navigate("/productos")}>
            Ver productos
          </button>
          <button type="button" className="role-dashboard-action-btn" onClick={() => navigate("/ubicacion")}>
            Ver ubicación
          </button>
        </div>
      </section>

      <section className="role-dashboard-footer">
        <button type="button" className="role-dashboard-action-btn role-dashboard-logout-btn" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </section>
    </main>
  );
}
