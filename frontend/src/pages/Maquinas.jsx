import { useNavigate } from "react-router-dom";
import "../styles/main.css";

function Maquinas() {
  const navigate = useNavigate();

  return (
    <div className="maquinas-page">
      <button
        className="btn-inicio"
        onClick={() => navigate("/")}
        aria-label="Volver a inicio"
      >
        Inicio
      </button>

      <div className="maquinas-content">
        <h1 className="maquinas-title">Máquinas</h1>

        <p className="maquinas-descripcion">
          En esta sección encontrarás las máquinas disponibles para realizar tus
          rutinas de ejercicio según tus objetivos. Cada equipo está diseñado
          para ayudarte a entrenar de forma segura, eficiente y a tu propio
          ritmo.
        </p>
        <div className="maquinas-galeria">
          <div className="maquina-card">
            <div className="maquina-box">
              <p className="galeria-placeholder">
                Próximamente aquí podrás explorar las máquinas disponibles.
              </p>
            </div>
            <span className="maquina-titulo">ZONA PARA CARDIO</span>
          </div>

          <div className="maquina-card">
            <div className="maquina-box">
              <p className="galeria-placeholder">
                Próximamente aquí podrás explorar las máquinas disponibles.
              </p>
            </div>
            <span className="maquina-titulo">ZONA DE TREN SUPERIOR</span>
          </div>

          <div className="maquina-card">
            <div className="maquina-box">
              <p className="galeria-placeholder">
                Próximamente aquí podrás explorar las máquinas disponibles.
              </p>
            </div>
            <span className="maquina-titulo">ZONA DE TREN INFERIOR</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Maquinas;
