import { Navigate, useNavigate } from "react-router-dom";
import { clearSession, getSession } from "../auth/session";
import "../styles/main.css";

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
    <main className="servicios-page">
      <section className="servicios-hero">
        <div className="hero-text">
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </section>

      <section className="flujo">
        <h2>Acciones Disponibles</h2>
        <div className="flujo-pasos">
          <button type="button" className="btn-volver-inicio" onClick={() => navigate("/servicios")}>
            Ver servicios
          </button>
          <button type="button" className="btn-volver-inicio" onClick={() => navigate("/productos")}>
            Ver productos
          </button>
          <button type="button" className="btn-volver-inicio" onClick={() => navigate("/ubicacion")}>
            Ver ubicación
          </button>
        </div>
      </section>

      <section className="roles">
        <button type="button" className="btn-volver-inicio" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </section>
    </main>
  );
}
