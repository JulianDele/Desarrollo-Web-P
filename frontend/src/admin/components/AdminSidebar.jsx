import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/admin.css";

export default function AdminSidebar({ setTitulo }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="admin-sidebar">
      <div className="sidebar-top">
        <button className="menu-toggle" onClick={() => setOpen(!open)}>
          ☰
        </button>
        <span className="side-logo">Gimnasio</span>
      </div>

      {open && (
        <div className="dropdown-sidebar">
          <button
            onClick={() => {
              navigate("/admin/servicios");
              setOpen(false);
            }}
          >
            Gestionar Servicios
          </button>

          <button
            onClick={() => {
              navigate("/admin/productos");
              setOpen(false);
            }}
          >
            Gestionar Productos
          </button>

          <button
            onClick={() => {
            navigate("/admin");
            setOpen(false);}}
            >
            Cerrar Sesión
          </button>
        </div>
        
      )}

      <p className="side-title">Principal</p>

      <button
        className="side-link"
        onClick={() => {
          setTitulo("Bienvenido al Panel Principal");
          navigate("/admin/dashboard");
        }}
      >
        Inicio
      </button>

      <button
        className="side-link"
        onClick={() => {
          setTitulo("Miembros");
          navigate("/admin/dashboard");
        }}
      >
        Miembros
      </button>

      <button
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
        className="side-link"
        onClick={() => {
          setTitulo("Membresías");
          navigate("/admin/dashboard");
        }}
      >
        Membresías
      </button>

      <button
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
