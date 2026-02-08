import "../styles/main.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

function MenuOverlay({ cerrarMenu }) {
  const navigate = useNavigate();
  const buttonsRef = useRef([]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const index = buttonsRef.current.indexOf(document.activeElement);

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = (index + 1) % buttonsRef.current.length;
        buttonsRef.current[next].focus();
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev =
          (index - 1 + buttonsRef.current.length) %
          buttonsRef.current.length;
        buttonsRef.current[prev].focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const irA = (ruta) => {
    cerrarMenu();
    navigate(ruta);
  };

  return (
    <div className="menu-overlay">
      <ul>
        <li>
          <button
            ref={(el) => (buttonsRef.current[0] = el)}
            onClick={() => irA("/maquinas")}
          >
            Ver máquinas
          </button>
        </li>

        <li>
          <button
            ref={(el) => (buttonsRef.current[1] = el)}
            onClick={() => irA("/servicios")}
          >
            Ver servicios
          </button>
        </li>

        <li>
          <button
            ref={(el) => (buttonsRef.current[2] = el)}
            onClick={() => irA("/productos")}
          >
            Ver productos
          </button>
        </li>

        <li>
          <button
            ref={(el) => (buttonsRef.current[3] = el)}
            onClick={() => irA("/ubicacion")}
          >
            Nuestra ubicación
          </button>
        </li>

        <li>
          <button
            ref={(el) => (buttonsRef.current[4] = el)}
            onClick={() => irA("/login")}
          >
            Iniciar sesión
          </button>
        </li>
      </ul>
    </div>
  );
}

export default MenuOverlay;
