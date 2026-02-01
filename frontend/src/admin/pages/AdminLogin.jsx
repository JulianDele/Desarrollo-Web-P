import { useNavigate } from "react-router-dom";
import "../styles/admin.css";

export default function AdminLogin() {
  const navigate = useNavigate();

  const iniciarSesionFake = () => {
    navigate("/admin/dashboard");
  };

  return (
    <div className="admin-content">
      <h2>Login Administrador</h2>

      <form className="admin-form" onSubmit={(e) => e.preventDefault()}>
        <label>Email</label>
        <input type="email" tabIndex="1" />

        <label>Contraseña</label>
        <input type="password" tabIndex="2" />

        <button
          type="submit"
          tabIndex="3"
          onClick={iniciarSesionFake}
        >
          Iniciar sesión
        </button>
        <button
          type="button"
          tabIndex="4"
          onClick={() => navigate("/admin/registro")}
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}
