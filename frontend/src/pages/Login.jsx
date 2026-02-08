import { useNavigate } from "react-router-dom";
import "../styles/main.css";
import gymLogo from "../assets/gym.png";

function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const fakeResponse = {
      role: "ADMIN", // Cambio de roll
      token: "fake-jwt-token"
    };

    localStorage.setItem("token", fakeResponse.token);
    localStorage.setItem("role", fakeResponse.role);

    if (fakeResponse.role === "ADMIN") {
      navigate("/admin/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="login-page">
      <header className="login-header">
        <div className="logo">
          <img src={gymLogo} alt="Gimnasio" className="logo-icon" />
          <span className="logo-text">GIMNASIO</span>
        </div>

        <button
          className="exit-btn"
          onClick={() => navigate("/")}
          title="Salir"
        >
          ⮐
        </button>
      </header>

      <div className="login-wrapper">
        <h2 className="login-title">INGRESA TU USUARIO</h2>

        <div className="login-container">
          <form onSubmit={handleSubmit} className="login-form">
            <label>NOMBRE DE USUARIO</label>
            <input type="text" required />

            <label>CORREO ELECTRONICO</label>
            <input type="email" required />

            <label>CONTRASEÑA</label>
            <input type="password" required />

            <button type="submit" className="login-btn">
              INICIAR
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
