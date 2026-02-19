import { useNavigate } from "react-router-dom";
import "../styles/main.css";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <h1>404</h1>
      <h2>Página no encontrada</h2>
      <p>Lo sentimos, la página que buscas no existe.</p>
      <button
        className="btn-inicio"
        onClick={() => navigate("/")}
      >
        Volver al inicio
      </button>
    </div>
  );
}

export default NotFound;
