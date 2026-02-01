import { useNavigate } from "react-router-dom";

function Servicios() {
  const navigate = useNavigate();

  return (
    <div className="pagina">
      <h1>Servicios</h1>

      <button className="btn-inicio" onClick={() => navigate("/")}>
        Inicio
      </button>
    </div>
  );
}

export default Servicios;
