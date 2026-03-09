import { useNavigate } from "react-router-dom";
import "./Maquinas.css";
import imagen1 from "../../assets/imagen1.jpg";
import imagen2 from "../../assets/imagen2.jpg";
import TopNavigation from "../../components/TopNavigation";
import useScrollReveal from "../../hooks/useScrollReveal";

function Maquinas() {
  const navigate = useNavigate();
  useScrollReveal();

  return (
    <div className="instalaciones-page with-global-topbar">
      <TopNavigation currentPage="instalaciones" />

      <section className="instalaciones-hero scroll-reveal">
        <div className="instalaciones-hero-copy">
          <p className="instalaciones-kicker">ÁREAS DE ENTRENAMIENTO</p>
          <h1>INSTALACIONES DE ALTO RENDIMIENTO</h1>
          <p>
            Espacios diseñados para entrenar con seguridad, fluidez y
            resultados: cardio, fuerza, movilidad y recuperación en un solo
            lugar.
          </p>

          <div className="instalaciones-actions">
            <button
              type="button"
              className="instalaciones-btn primary"
              onClick={() => navigate("/login")}
            >
              INSCRÍBETE
            </button>
            <button
              type="button"
              className="instalaciones-btn ghost"
              onClick={() => navigate("/servicios")}
            >
              VER SERVICIOS
            </button>
          </div>
        </div>

        <div className="instalaciones-hero-metrics">
          <article className="instalaciones-metric-card">
            <strong>4</strong>
            <span>ZONAS PRINCIPALES</span>
          </article>
          <article className="instalaciones-metric-card">
            <strong>+40</strong>
            <span>EQUIPOS DISPONIBLES</span>
          </article>
          <article className="instalaciones-metric-card">
            <strong>07:00 - 21:00</strong>
            <span>HORARIO CONTINUO</span>
          </article>
        </div>
      </section>

      <section className="instalaciones-grid">
        <article
          className="instalacion-card scroll-reveal scroll-reveal-left"
          style={{ "--reveal-delay": "0ms" }}
        >
          <img src={imagen1} alt="Zona funcional del gimnasio" />
          <div className="instalacion-overlay">
            <h3>ZONA FUNCIONAL</h3>
            <p>Entrenamiento dinámico para fuerza, agilidad y coordinación.</p>
            <button type="button" className="instalacion-chip">
              Funcional
            </button>
          </div>
        </article>

        <article
          className="instalacion-card scroll-reveal scroll-reveal-up"
          style={{ "--reveal-delay": "110ms" }}
        >
          <img src={imagen2} alt="Zona de cardio y fuerza del gimnasio" />
          <div className="instalacion-overlay">
            <h3>ZONA CARDIO Y FUERZA</h3>
            <p>Equipos para sesiones progresivas de resistencia y potencia.</p>
            <button type="button" className="instalacion-chip">
              Cardio + Fuerza
            </button>
          </div>
        </article>

        <article
          className="instalacion-card scroll-reveal scroll-reveal-right"
          style={{ "--reveal-delay": "220ms" }}
        >
          <div className="instalacion-gradient">
            <i className="fas fa-water" aria-hidden="true"></i>
            <h3>RECUPERACIÓN Y MOVILIDAD</h3>
            <p>
              Espacio enfocado en estiramiento, descarga muscular y
              acondicionamiento técnico.
            </p>
            <button type="button" className="instalacion-chip">
              Recuperación
            </button>
          </div>
        </article>
      </section>

      <section className="instalaciones-benefits scroll-reveal scroll-reveal-up">
        <h2>¿POR QUÉ ENTRENAR AQUÍ?</h2>
        <div className="instalaciones-benefit-list">
          <article className="instalaciones-benefit-item">
            <i className="fas fa-shield-alt" aria-hidden="true"></i>
            <h3>Seguridad Primero</h3>
            <p>Áreas señalizadas y equipos distribuidos para entrenar sin riesgo.</p>
          </article>
          <article className="instalaciones-benefit-item">
            <i className="fas fa-stopwatch" aria-hidden="true"></i>
            <h3>Flujo Eficiente</h3>
            <p>Diseño de zonas que reduce tiempos de espera en hora pico.</p>
          </article>
          <article className="instalaciones-benefit-item">
            <i className="fas fa-bolt" aria-hidden="true"></i>
            <h3>Resultados Reales</h3>
            <p>Infraestructura orientada a progresión constante y medible.</p>
          </article>
        </div>
      </section>
    </div>
  );
}

export default Maquinas;
