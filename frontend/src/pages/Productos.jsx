import { useNavigate } from "react-router-dom";

function Productos() {
  const navigate = useNavigate();

  return (
    <div className="pagina">
      <h1>Productos</h1>

      <button className="btn-inicio" onClick={() => navigate("/")}>
        Inicio
      </button>
    </div>
  );
}

export default Productos;
