import { useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Home.css";
import gymIcon from "../../assets/gym.png";
import videoBg from "../../assets/gimnacio.mp4";
import imagen1 from "../../assets/imagen1.jpg";
import imagen2 from "../../assets/imagen2.jpg";
import TopNavigation from "../../components/TopNavigation";
import useScrollReveal from "../../hooks/useScrollReveal";

function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const videoRef = useRef(null);
  useScrollReveal();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const LIMITE_SEGUNDOS = 64;

    const controlarTiempo = () => {
      if (video.currentTime >= LIMITE_SEGUNDOS) {
        video.currentTime = 0;
        video.play();
      }
    };

    video.addEventListener("timeupdate", controlarTiempo);

    return () => {
      video.removeEventListener("timeupdate", controlarTiempo);
    };
  }, []);

  useEffect(() => {
    if (!location.hash) return;

    const sectionId = location.hash.replace("#", "");
    requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [location.hash]);

  return (
    <div className="home-page">
      <section
        id="home-inicio"
        className="home"
      >
        <video
          ref={videoRef}
          className="video-bg"
          autoPlay
          muted
          playsInline
          aria-hidden="true"
        >
          <source src={videoBg} type="video/mp4" />
          Tu navegador no soporta videos HTML5.
        </video>

        <div className="overlay"></div>

        <TopNavigation currentPage="inicio" />

        <main className="home-content">
          <h1 className="titulo-gym">
            <img src={gymIcon} alt="Gym icon" />
            GIMNASIO
          </h1>
          <p>
            MÁS ALLÁ DE LOS LÍMITES, ESTÁ TU MEJOR VERSIÓN.
          </p>
          <div className="home-hero-actions">
            <button
              type="button"
              className="home-cta-btn"
              onClick={() => navigate("/login")}
            >
              INSCRÍBETE
            </button>
          </div>
        </main>

        <div id="home-contacto" className="contacto-fixed">
          <p>Contáctanos ya!!</p>
          <div className="contacto-iconos">
            <a
              href="https://www.whatsapp.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Abrir WhatsApp en una nueva pestaña"
            >
              <i className="fab fa-whatsapp" aria-hidden="true"></i>
            </a>
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Abrir Facebook en una nueva pestaña"
            >
              <i className="fab fa-facebook-f" aria-hidden="true"></i>
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Abrir Instagram en una nueva pestaña"
            >
              <i className="fab fa-instagram" aria-hidden="true"></i>
            </a>
            <a href="mailto:contacto@gimnasio.com" aria-label="Enviar correo a Gimnasio">
              <i className="fas fa-envelope" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      </section>

      <section id="home-informacion" className="home-section">
        <header className="home-section-header scroll-reveal">
          <span>Transforma Tu Bienestar</span>
          <h2>INFORMACIÓN CLAVE</h2>
        </header>

        <div className="home-info-grid">
          <article className="home-info-card scroll-reveal scroll-reveal-left" style={{ "--reveal-delay": "0ms" }}>
            <i className="fas fa-dumbbell" aria-hidden="true"></i>
            <h3>HORARIOS Y ACCESO</h3>
            <p>
              Abrimos de 7:00 AM a 9:00 PM con acceso y control de membresías.
            </p>
          </article>

          <article className="home-info-card scroll-reveal scroll-reveal-right" style={{ "--reveal-delay": "110ms" }}>
            <i className="fas fa-id-card" aria-hidden="true"></i>
            <h3>PLANES DE MEMBRESÍA</h3>
            <p>
              Opciones mensuales y promociones activas para nuevos integrantes.
            </p>
          </article>

          <article className="home-info-card scroll-reveal scroll-reveal-left" style={{ "--reveal-delay": "220ms" }}>
            <i className="fas fa-clipboard-check" aria-hidden="true"></i>
            <h3>EVALUACIÓN INICIAL</h3>
            <p>
              Diagnóstico físico para definir objetivos y seguimiento de progreso.
            </p>
          </article>

          <article className="home-info-card scroll-reveal scroll-reveal-right" style={{ "--reveal-delay": "330ms" }}>
            <i className="fas fa-apple-alt" aria-hidden="true"></i>
            <h3>NUTRICIÓN Y GUÍA</h3>
            <p>
              Recomendaciones complementarias para potenciar tus resultados.
            </p>
          </article>
        </div>
      </section>

      <section id="home-instalaciones" className="home-section">
        <header className="home-section-header scroll-reveal">
          <span>Conoce Nuestro Espacio</span>
          <h2>INSTALACIONES</h2>
        </header>

        <div className="home-installations-grid">
          <article className="home-install-card scroll-reveal scroll-reveal-left" style={{ "--reveal-delay": "0ms" }}>
            <img src={imagen1} alt="Zona de entrenamiento funcional del gimnasio" />
            <div className="home-install-overlay">
              <h3>ZONA FUNCIONAL</h3>
              <p>Área equipada para fuerza, resistencia y movilidad.</p>
            </div>
          </article>

          <article className="home-install-card scroll-reveal scroll-reveal-up" style={{ "--reveal-delay": "140ms" }}>
            <img src={imagen2} alt="Área principal con máquinas de cardio y fuerza" />
            <div className="home-install-overlay">
              <h3>ZONA CARDIO Y FUERZA</h3>
              <p>Equipos modernos para entrenamientos completos.</p>
            </div>
          </article>

          <article className="home-install-card scroll-reveal scroll-reveal-right" style={{ "--reveal-delay": "280ms" }}>
            <div className="home-install-gradient">
              <i className="fas fa-swimmer" aria-hidden="true"></i>
              <h3>ALBERCA SEMIOLÍMPICA</h3>
              <p>Instalación ideal para trabajo de resistencia y recuperación.</p>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}

export default Home;
