import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/main.css";
import gymLogo from "../assets/gym.png";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

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

    if (Object.keys(newErrors).length !== 0) {
      setServerError("");
      return;
    }

    setServerError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setServerError(data.message || "No se pudo iniciar sesión");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role || "ADMIN");
      navigate("/admin/dashboard");
    } catch {
      setServerError("No se pudo conectar con el servidor");
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
            />
            {errors.username && (
              <p className="error-text">{errors.username}</p>
            )}

            <label>CORREO ELECTRONICO</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "input-error" : ""}
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
            />
            {errors.password && (
              <p className="error-text">{errors.password}</p>
            )}

            <button type="submit" className="login-btn">
              INICIAR
            </button>
            {serverError && <p className="error-text">{serverError}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
