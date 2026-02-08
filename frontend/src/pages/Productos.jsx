import { useNavigate } from "react-router-dom";
import "../styles/main.css";

function Productos() {
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
        <h1 className="maquinas-title">Productos</h1>

        <p className="maquinas-descripcion">
          Equípate con productos diseñados para acompañarte en cada repetición,
          cada gota de sudor y cada meta alcanzada. Entrena más fuerte, más
          seguro y más inteligente. Tu mejor versión comienza aquí.
        </p>

        <div className="maquinas-galeria">
          <div className="maquina-card">
            <div className="maquina-box">
              <p className="galeria-placeholder">
                Próximamente aquí podrás explorar los productos disponibles.
              </p>
            </div>
            <span className="maquina-titulo">
              Suplemento que ayuda a aumentar la fuerza y mejorar el rendimiento.
            </span>
          </div>

          <div className="maquina-card">
            <div className="maquina-box">
              <p className="galeria-placeholder">
                Próximamente aquí podrás explorar los productos disponibles.
              </p>
            </div>
            <span className="maquina-titulo">
              Suplemento proteico que apoya la recuperación muscular.
            </span>
          </div>

          <div className="maquina-card">
            <div className="maquina-box">
              <p className="galeria-placeholder">
                Próximamente aquí podrás explorar los productos disponibles.
              </p>
            </div>
            <span className="maquina-titulo">
              Suplemento formulado para aumentar la energía y la intensidad.
            </span>
          </div>
        </div>
      </div>
      
      <div className="maquinas-content">
        <h1 className="maquinas-title">Bebidas</h1>

        <p className="maquinas-descripcion">
          Bebidas pensadas para hidratarte, recuperar energía y acompañarte antes,
          durante y después de tu entrenamiento. Refresca tu esfuerzo y sigue avanzando.
        </p>

        <div className="maquinas-galeria">
          <div className="maquina-card">
            <div className="maquina-box">
              <p className="galeria-placeholder">
                Próximamente aquí podrás explorar las bebidas disponibles.
              </p>
            </div>
            <span className="maquina-titulo">
              Bebida energética diseñada para hidratar y potenciar tu rendimiento.
            </span>
          </div>

          <div className="maquina-card">
            <div className="maquina-box">
              <p className="galeria-placeholder">
                Próximamente aquí podrás explorar las bebidas disponibles.
              </p>
            </div>
            <span className="maquina-titulo">
              Bebida proteica ideal para apoyar la recuperación después del entrenamiento.
            </span>
          </div>

          <div className="maquina-card">
            <div className="maquina-box">
              <p className="galeria-placeholder">
                Próximamente aquí podrás explorar las bebidas disponibles.
              </p>
            </div>
            <span className="maquina-titulo">
              Bebida funcional que ayuda a mantener la energía y el enfoque durante el ejercicio.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Productos;
