import { useNavigate } from "react-router-dom";

function Ubicacion() {
  const navigate = useNavigate();

  return (
    <div className="pagina">
      <h1>Ubicación</h1>

      <button className="btn-inicio" onClick={() => navigate("/")}>
        Inicio
      </button>
    </div>
  );
}

export default Ubicacion;
