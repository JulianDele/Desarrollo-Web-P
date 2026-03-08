import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/main.css";
import gymLogo from "../assets/gym.png";
import loginHeroImage from "../assets/imagen2.jpg";
import { getDefaultRouteByRole, getSession, setSession } from "../auth/session";
import TopNavigation from "../components/TopNavigation";

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
  const [activePanel, setActivePanel] = useState("login");
  const [registerData, setRegisterData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [registerErrors, setRegisterErrors] = useState({});
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");
  const [isRegisterSubmitting, setIsRegisterSubmitting] = useState(false);

  useEffect(() => {
    const { token, role } = getSession();

    if (token) {
      navigate(getDefaultRouteByRole(role), { replace: true });
    }
  }, [navigate]);

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

      if (!data.token) {
        setServerError("Respuesta inválida del servidor");
        return;
      }

      const serverRole = data.role || data.user?.role || "guest";
      setSession({ token: data.token, role: serverRole });
      navigate(getDefaultRouteByRole(serverRole), { replace: true });
    } catch {
      setServerError("No se pudo conectar con el servidor");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    const emailPattern = /\S+@\S+\.\S+/;

    if (!registerData.name.trim()) {
      newErrors.name = "Este campo es obligatorio";
    }

    if (!registerData.username.trim()) {
      newErrors.username = "Este campo es obligatorio";
    }

    if (!registerData.email.trim()) {
      newErrors.email = "Este campo es obligatorio";
    } else if (!emailPattern.test(registerData.email)) {
      newErrors.email = "Ingresa un correo válido";
    }

    if (!registerData.password.trim()) {
      newErrors.password = "Este campo es obligatorio";
    } else if (registerData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (!registerData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Este campo es obligatorio";
    } else if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setRegisterErrors(newErrors);

    if (Object.keys(newErrors).length !== 0) {
      setRegisterError("");
      return;
    }

    setRegisterError("");
    setRegisterSuccess("");
    setIsRegisterSubmitting(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: registerData.name,
          username: registerData.username,
          email: registerData.email,
          password: registerData.password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setRegisterError(data.message || "No se pudo registrar la cuenta");
        return;
      }

      if (data.token) {
        const serverRole = data.role || data.user?.role || "user";
        setSession({ token: data.token, role: serverRole });
        navigate(getDefaultRouteByRole(serverRole), { replace: true });
        return;
      }

      setRegisterSuccess(data.message || "Cuenta registrada. Ya puedes iniciar sesión.");
      setFormData((previous) => ({
        ...previous,
        username: registerData.username,
        email: registerData.email,
        password: "",
      }));
      setActivePanel("login");
      setRegisterData({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setRegisterErrors({});
    } catch {
      setRegisterError("No se pudo conectar con el servidor");
    } finally {
      setIsRegisterSubmitting(false);
    }
  };

  const openLoginPanel = () => {
    setActivePanel("login");
    setRegisterError("");
    setRegisterErrors({});
  };

  const openRegisterPanel = () => {
    setActivePanel("register");
    setServerError("");
    setErrors({});
    setRegisterSuccess("");
  };

  return (
    <div className="login-page">
      <TopNavigation currentPage="login" />
      <div className="login-background" aria-hidden="true">
        <img
          src={loginHeroImage}
          alt=""
          className="login-background-image"
          loading="eager"
        />
      </div>
      <div className="login-overlay" aria-hidden="true"></div>
      <div className="login-glow" aria-hidden="true"></div>

      <header className="login-header">
        <div className="login-brand">
          <img src={gymLogo} alt="Gimnasio" className="logo-icon" />
          <span className="logo-text">GIMNASIO</span>
        </div>

        <div className="login-header-actions">
          <button
            type="button"
            className="login-home-btn"
            onClick={() => navigate("/")}
          >
            INICIO
          </button>
          <button
            type="button"
            className="exit-btn"
            onClick={() => navigate("/")}
            aria-label="Volver al inicio"
            title="Salir"
          >
            ⮐
          </button>
        </div>
      </header>

      <div className="login-wrapper">
        <section className="login-hero-content">
          <p className="login-kicker">MÁS ENERGÍA, MÁS DISCIPLINA</p>
          <h1 className="login-hero-title">
            TU MEJOR
            <br />
            VERSIÓN INICIA
            <br />
            AQUÍ
          </h1>
          <p className="login-hero-description">
            Inicia sesión para acceder a tus beneficios, membresía y panel
            personalizado según tu rol.
          </p>

          <div className="login-hero-badges" aria-hidden="true">
            <span>+50 CLASES</span>
            <span>ENTRENADORES CERTIFICADOS</span>
            <span>INSTALACIONES PREMIUM</span>
          </div>
        </section>

        <div className="login-container">
          <div className="auth-tabs" role="tablist" aria-label="Acceso de cuenta">
            <button
              type="button"
              className={`auth-tab ${activePanel === "login" ? "is-active" : ""}`}
              role="tab"
              aria-selected={activePanel === "login"}
              onClick={openLoginPanel}
            >
              INICIAR SESIÓN
            </button>
            <button
              type="button"
              className={`auth-tab ${activePanel === "register" ? "is-active" : ""}`}
              role="tab"
              aria-selected={activePanel === "register"}
              onClick={openRegisterPanel}
            >
              REGISTRARME
            </button>
          </div>

          {activePanel === "login" ? (
            <>
              <h2 className="login-title">INGRESA TU USUARIO</h2>
              <p className="login-subtitle">Accede a tu cuenta de entrenamiento</p>
              {registerSuccess && (
                <p className="auth-success-text" role="status" aria-live="polite">
                  {registerSuccess}
                </p>
              )}
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
                  placeholder="Usuario"
                  autoComplete="username"
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
                  placeholder="correo@ejemplo.com"
                  autoComplete="email"
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
                  placeholder="********"
                  autoComplete="current-password"
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

              <div className="login-register-cta">
                <p>¿No tienes cuenta?</p>
                <button
                  type="button"
                  className="login-switch-btn"
                  onClick={openRegisterPanel}
                >
                  REGÍSTRATE AQUÍ
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="login-title">CREA TU CUENTA</h2>
              <p className="login-subtitle">Registro rápido para nuevos usuarios</p>

              <form
                onSubmit={handleRegisterSubmit}
                className="login-form register-form"
                aria-describedby={registerError ? "register-server-error" : undefined}
              >
                <label htmlFor="register-name">NOMBRE COMPLETO</label>
                <input
                  id="register-name"
                  type="text"
                  name="name"
                  value={registerData.name}
                  onChange={handleRegisterChange}
                  placeholder="Nombre completo"
                  autoComplete="name"
                  disabled={isRegisterSubmitting}
                  className={registerErrors.name ? "input-error" : ""}
                  aria-invalid={Boolean(registerErrors.name)}
                  aria-describedby={registerErrors.name ? "register-name-error" : undefined}
                />
                {registerErrors.name && (
                  <p id="register-name-error" className="error-text" role="alert">
                    {registerErrors.name}
                  </p>
                )}

                <label htmlFor="register-username">NOMBRE DE USUARIO</label>
                <input
                  id="register-username"
                  type="text"
                  name="username"
                  value={registerData.username}
                  onChange={handleRegisterChange}
                  placeholder="Usuario"
                  autoComplete="username"
                  disabled={isRegisterSubmitting}
                  className={registerErrors.username ? "input-error" : ""}
                  aria-invalid={Boolean(registerErrors.username)}
                  aria-describedby={
                    registerErrors.username ? "register-username-error" : undefined
                  }
                />
                {registerErrors.username && (
                  <p id="register-username-error" className="error-text" role="alert">
                    {registerErrors.username}
                  </p>
                )}

                <label htmlFor="register-email">CORREO ELECTRONICO</label>
                <input
                  id="register-email"
                  type="email"
                  name="email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  placeholder="correo@ejemplo.com"
                  autoComplete="email"
                  disabled={isRegisterSubmitting}
                  className={registerErrors.email ? "input-error" : ""}
                  aria-invalid={Boolean(registerErrors.email)}
                  aria-describedby={registerErrors.email ? "register-email-error" : undefined}
                />
                {registerErrors.email && (
                  <p id="register-email-error" className="error-text" role="alert">
                    {registerErrors.email}
                  </p>
                )}

                <label htmlFor="register-password">CONTRASEÑA</label>
                <input
                  id="register-password"
                  type="password"
                  name="password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  placeholder="Mínimo 6 caracteres"
                  autoComplete="new-password"
                  disabled={isRegisterSubmitting}
                  className={registerErrors.password ? "input-error" : ""}
                  aria-invalid={Boolean(registerErrors.password)}
                  aria-describedby={
                    registerErrors.password ? "register-password-error" : undefined
                  }
                />
                {registerErrors.password && (
                  <p id="register-password-error" className="error-text" role="alert">
                    {registerErrors.password}
                  </p>
                )}

                <label htmlFor="register-confirm-password">CONFIRMAR CONTRASEÑA</label>
                <input
                  id="register-confirm-password"
                  type="password"
                  name="confirmPassword"
                  value={registerData.confirmPassword}
                  onChange={handleRegisterChange}
                  placeholder="Repite tu contraseña"
                  autoComplete="new-password"
                  disabled={isRegisterSubmitting}
                  className={registerErrors.confirmPassword ? "input-error" : ""}
                  aria-invalid={Boolean(registerErrors.confirmPassword)}
                  aria-describedby={
                    registerErrors.confirmPassword
                      ? "register-confirm-password-error"
                      : undefined
                  }
                />
                {registerErrors.confirmPassword && (
                  <p
                    id="register-confirm-password-error"
                    className="error-text"
                    role="alert"
                  >
                    {registerErrors.confirmPassword}
                  </p>
                )}

                <button
                  type="submit"
                  className="login-btn"
                  disabled={isRegisterSubmitting}
                  aria-busy={isRegisterSubmitting}
                >
                  {isRegisterSubmitting ? "REGISTRANDO..." : "REGISTRARME"}
                </button>

                {isRegisterSubmitting && (
                  <div
                    className="loader-wrapper"
                    role="status"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    <div className="loader" aria-hidden="true"></div>
                    <span className="loader-text">Creando tu cuenta...</span>
                    <span className="sr-only">Cargando</span>
                  </div>
                )}

                {registerError && (
                  <p id="register-server-error" className="error-text" role="alert">
                    {registerError}
                  </p>
                )}
              </form>

              <div className="login-register-cta">
                <p>¿Ya tienes cuenta?</p>
                <button
                  type="button"
                  className="login-switch-btn"
                  onClick={openLoginPanel}
                >
                  VOLVER A INICIAR SESIÓN
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
