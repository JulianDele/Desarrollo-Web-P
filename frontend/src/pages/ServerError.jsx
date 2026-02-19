import { useNavigate } from "react-router-dom";
import "../styles/main.css";

function ServerError() {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <h1>500</h1>
      <h2>Error del servidor</h2>
      <p>Algo salió mal. Por favor, intenta más tarde.</p>
      <button
        className="btn-inicio"
        onClick={() => navigate("/")}
      >
        Volver al inicio
      </button>
    </div>
  );
}

export default ServerError;
