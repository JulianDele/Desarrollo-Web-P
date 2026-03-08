import { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import MenuOverlay from "../components/MenuOverlay";
import "../styles/main.css";
import gymIcon from "../assets/gym.png";
import videoBg from "../assets/gimnacio.mp4";

function Home() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const videoRef = useRef(null);
  const menuButtonRef = useRef(null);
  const menuId = "main-menu-overlay";

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

  return (
    <div
      className="home"
      onClick={() => menuAbierto && setMenuAbierto(false)}
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

      <div onClick={(e) => e.stopPropagation()}>
        <Navbar
          onToggleMenu={() => setMenuAbierto((prev) => !prev)}
          menuAbierto={menuAbierto}
          menuId={menuId}
          menuButtonRef={menuButtonRef}
        />

        {menuAbierto && (
          <MenuOverlay
            cerrarMenu={() => setMenuAbierto(false)}
            triggerRef={menuButtonRef}
            menuId={menuId}
          />
        )}
      </div>

      <main className="home-content">
        <h1 className="titulo-gym">
          <img src={gymIcon} alt="Gym icon" />
          GIMNASIO
        </h1>
        <p>
          INFORMACIÓN RELEVANTE DEL GIMNASIO O CONTENIDO (SE TU MEJOR YO PAPS)
        </p>
      </main>

      <div className="contacto-fixed">
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
    </div>
  );
}

export default Home;
