import { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import MenuOverlay from "../components/MenuOverlay";
import "../styles/main.css";
import gymIcon from "../assets/gym.png";
import videoBg from "../assets/gimnacio.mp4";

function Home() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const videoRef = useRef(null);

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
        <Navbar onToggleMenu={() => setMenuAbierto((prev) => !prev)} />
      </div>

      <div className="home-content">
        <h1 className="titulo-gym">
          <img src={gymIcon} alt="Gym icon" />
          GIMNASIO
        </h1>
        <p>
          INFORMACIÓN RELEVANTE DEL GIMNASIO O CONTENIDO (SE TU MEJOR YO PAPS)
        </p>
      </div>

      {menuAbierto && (
        <MenuOverlay cerrarMenu={() => setMenuAbierto(false)} />
      )}

      <div className="contacto-fixed">
        <p>Contáctanos ya!!</p>
        <div className="contacto-iconos">
          <a href="#" aria-label="WhatsApp">
            <i className="fab fa-whatsapp"></i>
          </a>
          <a href="#" aria-label="Facebook">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" aria-label="Instagram">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="#" aria-label="Gmail">
            <i className="fas fa-envelope"></i>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Home;
