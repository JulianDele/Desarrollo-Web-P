import "../styles/main.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { getDefaultRouteByRole, getSession } from "../auth/session";

function MenuOverlay({ cerrarMenu, triggerRef, menuId = "main-menu-overlay" }) {
  const navigate = useNavigate();
  const buttonsRef = useRef([]);
  const { token, role } = getSession();

  useEffect(() => {
    buttonsRef.current[0]?.focus();
  }, []);

  const closeMenu = () => {
    cerrarMenu();

    if (triggerRef?.current) {
      requestAnimationFrame(() => {
        triggerRef.current?.focus();
      });
    }
  };

  const irA = (ruta) => {
    closeMenu();
    navigate(ruta);
  };

  const handleKeyDown = (e) => {
    const items = buttonsRef.current.filter(Boolean);
    const index = items.indexOf(document.activeElement);

    if (e.key === "Escape") {
      e.preventDefault();
      closeMenu();
      return;
    }

    if (items.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = (index + 1 + items.length) % items.length;
      items[next].focus();
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = (index - 1 + items.length) % items.length;
      items[prev].focus();
    }

    if (e.key === "Home") {
      e.preventDefault();
      items[0].focus();
    }

    if (e.key === "End") {
      e.preventDefault();
      items[items.length - 1].focus();
    }
  };

  return (
    <div
      className="menu-overlay"
      id={menuId}
      role="dialog"
      aria-modal="true"
      aria-label="Menú principal"
      onKeyDown={handleKeyDown}
    >
      <ul>
        <li>
          <button
            type="button"
            ref={(el) => (buttonsRef.current[0] = el)}
            onClick={() => irA("/maquinas")}
          >
            Ver máquinas
          </button>
        </li>

        <li>
          <button
            type="button"
            ref={(el) => (buttonsRef.current[1] = el)}
            onClick={() => irA("/servicios")}
          >
            Ver servicios
          </button>
        </li>

        <li>
          <button
            type="button"
            ref={(el) => (buttonsRef.current[2] = el)}
            onClick={() => irA("/productos")}
          >
            Ver productos
          </button>
        </li>

        <li>
          <button
            type="button"
            ref={(el) => (buttonsRef.current[3] = el)}
            onClick={() => irA("/ubicacion")}
          >
            Nuestra ubicación
          </button>
        </li>

        <li>
          <button
            type="button"
            ref={(el) => (buttonsRef.current[4] = el)}
            onClick={() => irA(token ? getDefaultRouteByRole(role) : "/login")}
          >
            {token ? "Ir a mi panel" : "Iniciar sesión"}
          </button>
        </li>
      </ul>
    </div>
  );
}

export default MenuOverlay;
