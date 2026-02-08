import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AdminSidebar({ setTitulo }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="admin-sidebar">
      <div className="sidebar-top">
        <button
          type="button"
          className="menu-toggle"
          aria-label="Alternar menú"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
        <span className="side-logo">Gimnasio</span>
      </div>

      {open && (
        <div className="dropdown-sidebar">
          <button
            type="button"
            onClick={() => {
              navigate("/admin/servicios");
              setOpen(false);
            }}
          >
            Gestionar Servicios
          </button>

          <button
            type="button"
            onClick={() => {
              navigate("/admin/productos");
              setOpen(false);
            }}
          >
            Gestionar Productos
          </button>

          <button
            type="button"
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
