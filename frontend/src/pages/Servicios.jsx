import { useNavigate } from "react-router-dom";
import "../styles/main.css";
import imagen1 from "../assets/imagen1.jpg";
import imagen2 from "../assets/imagen2.jpg";

function Servicios() {
  const navigate = useNavigate();

  return (
    <div className="servicios-page">
      <button
        className="btn-volver-inicio"
        onClick={() => navigate("/")}
        aria-label="Volver a la página principal"
      >
        Volver al inicio
      </button>

      <section className="servicios-hero">
        <div className="servicios-hero-top">
          <img src={imagen1} alt="Gestión de servicios del gimnasio" />
          <div className="hero-text">
            <h1>NUESTRO SERVICIOS</h1>
            <p>Plataforma dedicada a la información del gimnasio</p>
          </div>
        </div>

        <div className="servicios-hero-bottom">
          <img src={imagen2} alt="Instalaciones del gimnasio" />
          <div className="hero-text center">
            <h2>SÉ TU MEJOR SISTEMA</h2>
            <p>
              Optimiza tu tiempo y simplifica tus tareas
            </p>
          </div>
        </div>
      </section>

      <section className="gestionamos">
        <h2>¿QUÉ GESTIONAMOS?</h2>

        <div className="gestion-cards">
          <div className="gestion-card">
            <div className="img-placeholder">Próximamente</div>
            <h3>USUARIOS</h3>
            <p>Registro de clientes, historial y control de accesos.</p>
          </div>

          <div className="gestion-card">
            <div className="img-placeholder">Próximamente</div>
            <h3>MEMBRESÍAS</h3>
            <p>Control de precios, vencimientos y pagos.</p>
          </div>

          <div className="gestion-card">
            <div className="img-placeholder">Próximamente</div>
            <h3>ENTRENADORES</h3>
            <p>Horarios, entrenamientos y disponibilidad.</p>
          </div>
        </div>
      </section>

      <section className="flujo">
        <h2>NUESTRO FLUJO</h2>

        <div className="flujo-pasos">
          <div className="flujo-item">REGISTRO</div>
          <span>→</span>
          <div className="flujo-item">MEMBRESÍA</div>
          <span>→</span>
          <div className="flujo-item">USO DE SERVICIOS</div>
          <span>→</span>
          <div className="flujo-item">PAGOS</div>
        </div>
      </section>

      <section className="roles">
        <h2>SISTEMA POR ROLES</h2>

        <div className="roles-cards">
          <div className="rol-card">
            <div className="rol-img">Próximamente</div>
            <h3>ADMINISTRADOR</h3>
            <p>
              Control total del sistema, gestión de servicios, usuarios y
              reportes.
            </p>
          </div>

          <div className="rol-card">
            <div className="rol-img">Próximamente</div>
            <h3>RECEPCIONISTA</h3>
            <p>
              Consulta de membresías, pagos y atención a clientes.
            </p>
          </div>

          <div className="rol-card">
            <div className="rol-img">Próximamente</div>
            <h3>CLIENTE</h3>
            <p>
              Visualización de servicios, precios y horarios.
            </p>
          </div>
        </div>
      </section>

      <footer className="servicios-footer">
        <div>
          <h4>DIRECCIÓN</h4>
          <p>Calle Cervantes, 34, Madrid, CP 28001</p>
        </div>

        <div>
          <h4>CORREO</h4>
          <p>hola@unsitiogenial.es</p>
        </div>

        <div>
          <h4>TELÉFONO</h4>
          <p>923 456 789</p>
        </div>
      </footer>
    </div>
  );
}

export default Servicios;
