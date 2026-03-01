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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);

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
    } finally {
      setIsSubmitting(false);
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
          type="button"
          className="exit-btn"
          onClick={() => navigate("/")}
          aria-label="Volver al inicio"
          title="Salir"
        >
          ⮐
        </button>
      </header>

      <div className="login-wrapper">
        <h2 className="login-title">INGRESA TU USUARIO</h2>

        <div className="login-container">
          <form
            onSubmit={handleSubmit}
            className="login-form"
            aria-describedby={serverError ? "login-server-error" : undefined}
          >
            
            <label htmlFor="username">NOMBRE DE USUARIO</label>
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled={isSubmitting}
              className={errors.username ? "input-error" : ""}
              aria-invalid={Boolean(errors.username)}
              aria-describedby={errors.username ? "username-error" : undefined}
            />
            {errors.username && (
              <p id="username-error" className="error-text" role="alert">
                {errors.username}
              </p>
            )}

            <label htmlFor="email">CORREO ELECTRONICO</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
              className={errors.email ? "input-error" : ""}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" className="error-text" role="alert">
                {errors.email}
              </p>
            )}

            <label htmlFor="password">CONTRASEÑA</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={isSubmitting}
              className={errors.password ? "input-error" : ""}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            {errors.password && (
              <p id="password-error" className="error-text" role="alert">
                {errors.password}
              </p>
            )}

            <button
              type="submit"
              className="login-btn"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? "INGRESANDO..." : "INICIAR"}
            </button>

            {isSubmitting && (
              <div
                className="loader-wrapper"
                role="status"
                aria-live="polite"
                aria-atomic="true"
              >
                <div className="loader" aria-hidden="true"></div>
                <span className="loader-text">Validando credenciales...</span>
                <span className="sr-only">Cargando</span>
              </div>
            )}

            {serverError && (
              <p id="login-server-error" className="error-text" role="alert">
                {serverError}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
