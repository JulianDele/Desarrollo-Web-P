import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export default function AdminSidebar({ setTitulo }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const quickActionsRef = useRef([]);
  const toggleRef = useRef(null);
  const dropdownId = "admin-sidebar-menu";

  useEffect(() => {
    if (open) {
      quickActionsRef.current[0]?.focus();
    }
  }, [open]);

  const handleDropdownKeyDown = (e) => {
    const items = quickActionsRef.current.filter(Boolean);
    const index = items.indexOf(document.activeElement);

    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      requestAnimationFrame(() => {
        toggleRef.current?.focus();
      });
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
  };

  return (
    <div className="admin-sidebar">
      <div className="sidebar-top">
        <button
          type="button"
          className="menu-toggle"
          ref={toggleRef}
          aria-label="Alternar menú"
          aria-expanded={open}
          aria-controls={dropdownId}
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
        <span className="side-logo">Gimnasio</span>
      </div>

      {open && (
        <div
          className="dropdown-sidebar"
          id={dropdownId}
          role="menu"
          aria-label="Acciones rápidas"
          onKeyDown={handleDropdownKeyDown}
        >
          <button
            type="button"
            role="menuitem"
            ref={(el) => (quickActionsRef.current[0] = el)}
            onClick={() => {
              navigate("/admin/servicios");
              setOpen(false);
            }}
          >
            Gestionar Servicios
          </button>

          <button
            type="button"
            role="menuitem"
            ref={(el) => (quickActionsRef.current[1] = el)}
            onClick={() => {
              navigate("/admin/productos");
              setOpen(false);
            }}
          >
            Gestionar Productos
          </button>

          <button
            type="button"
            role="menuitem"
            ref={(el) => (quickActionsRef.current[2] = el)}
            onClick={() => {
              navigate("/admin");
              setOpen(false);
            }}
          >
            Cerrar Sesión
          </button>
        </div>
        
      )}

      <p className="side-title">Principal</p>

      <button
        type="button"
        className="side-link"
        onClick={() => {
          setTitulo("Bienvenido al Panel Principal");
          navigate("/admin/dashboard");
        }}
      >
        Inicio
      </button>

      <button
        type="button"
        className="side-link"
        onClick={() => {
          setTitulo("Miembros");
          navigate("/admin/dashboard");
        }}
      >
        Miembros
      </button>

      <button
        type="button"
        className="side-link"
        onClick={() => {
          setTitulo("Registros");
          navigate("/admin/dashboard");
        }}
      >
        Registros
      </button>

      <p className="side-title">Gestión</p>

      <button
        type="button"
        className="side-link"
        onClick={() => {
          setTitulo("Membresías");
          navigate("/admin/dashboard");
        }}
      >
        Membresías
      </button>

      <button
        type="button"
        className="side-link"
        onClick={() => {
          setTitulo("Horarios");
          navigate("/admin/dashboard");
        }}
      >
        Horarios
      </button>
    </div>
  );
}
