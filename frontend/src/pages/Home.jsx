import { useState } from "react";
import Navbar from "../components/Navbar";
import MenuOverlay from "../components/MenuOverlay";
import "../styles/main.css";
import gymIcon from "../assets/gym.png";

function Home() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <div
      className="home"
      onClick={() => menuAbierto && setMenuAbierto(false)}
    >
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
