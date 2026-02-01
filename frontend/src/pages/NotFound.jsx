import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="error-page" role="alert" aria-live="assertive">
      <div>
        <button onClick={() => navigate("/")}>Regresar</button>
      </div>
      <h1>404</h1>
      <h2>Página no encontrada</h2>
      <p>La página que buscas no existe o fue movida.</p>
    </div>
  );
}
