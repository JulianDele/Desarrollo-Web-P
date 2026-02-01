import { useNavigate } from "react-router-dom";

export default function ServerError() {
  const navigate = useNavigate();

  return (
    <div
      className="error-page"
      role="alert"
      aria-live="assertive"
    >
      <div>
        <button onClick={() => navigate("/")}>Regresar</button>
      </div>
      <h1>500</h1>
      <h2>Error interno del sistema</h2>
      <p>
        Ocurrió un problema en el servidor o en la aplicación.
        Intenta nuevamente o regresa al inicio.
      </p>
    </div>
  );
}
