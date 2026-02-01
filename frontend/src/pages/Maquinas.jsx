import { useNavigate } from "react-router-dom";

function Maquinas() {
  const navigate = useNavigate();
  return (
    <div className="pagina">
      <h1>Máquinas</h1>

      <button className="btn-inicio" onClick={() => navigate("/")}>
        Inicio
      </button>

      <p>¿QUÉ GESTIONAMOS?</p>
      <p>SISTEMA POR ROLES</p>

      <button onClick={() => navigate("/NotFound")}>
        ver maquinas disponibles 
      </button>

      <br /><br />

      <button onClick={() => navigate("/ServerError")}>
        Solicitar servicio 
      </button>
    </div>
  );
}

export default Maquinas;
