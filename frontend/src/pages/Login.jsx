import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/main.css";
import gymLogo from "../assets/gym.png";

import { loginUser } from "../services/api";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Este campo es obligatorio";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Este campo es obligatorio";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Este campo es obligatorio";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length !== 0) return;

    setLoading(true);
    setLoginError(null);

    try {
      const response = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem("token", response.token);
      localStorage.setItem("role", response.role);

      navigate("/admin/dashboard");
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoading(false);
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
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? "input-error" : ""}
              aria-invalid={!!errors.username}
            />
            {errors.username && (
              <p className="error-text">{errors.username}</p>
            )}

            <label>CORREO ELECTRÓNICO</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "input-error" : ""}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="error-text">{errors.email}</p>
            )}

            <label>CONTRASEÑA</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "input-error" : ""}
              aria-invalid={!!errors.password}
            />
            {errors.password && (
              <p className="error-text">{errors.password}</p>
            )}

            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              INICIAR
            </button>

            {loading && <Loader text="Iniciando sesión..." />}
            {!loading && loginError && (
              <ErrorMessage message={loginError} />
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
