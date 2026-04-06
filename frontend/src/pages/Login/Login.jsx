import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Login.css";
import gymLogo from "../../assets/gym.png";
import loginHeroImage from "../../assets/imagen2.jpg";
import { apiUrl, getDefaultRouteByRole, getSession, setSession } from "../../auth/session";
import TopNavigation from "../../components/TopNavigation";

/**
 * Mensajes de UX para 401 y 403 segÃºn ?reason= en la URL:
 *  ?reason=expired   -> sesiÃ³n expirada (401)
 *  ?reason=forbidden -> acceso denegado (403)
 *  ?reason=error     -> error inesperado
 */
const REASON_MESSAGES = {
  expired: "Tu sesiÃ³n ha expirado. Por favor inicia sesiÃ³n nuevamente.",
  forbidden: "No tienes permisos para acceder a esa secciÃ³n.",
  error: "OcurriÃ³ un error inesperado. Por favor inicia sesiÃ³n nuevamente.",
};

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reason = searchParams.get("reason");
  const reasonMessage = REASON_MESSAGES[reason] || null;

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

    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Este campo es obligatorio";
    if (!formData.email.trim()) newErrors.email = "Este campo es obligatorio";
    if (!formData.password.trim()) newErrors.password = "Este campo es obligatorio";

    setErrors(newErrors);
    if (Object.keys(newErrors).length !== 0) {
      setServerError("");
      return;
    }

    setServerError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(apiUrl("/api/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        setServerError("Credenciales invÃ¡lidas");
        return;
      }

      if (!response.ok) {
        setServerError(data.message || "No se pudo iniciar sesiÃ³n");
        return;
      }

      if (!data.accessToken) {
        setServerError("Respuesta invÃ¡lida del servidor");
        return;
      }

      const serverRole = data.role || data.user?.role || "guest";

      setSession({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        role: serverRole,
        sessionId: data.sessionId,
        expiresAt: data.expiresAt,
      });

      navigate(getDefaultRouteByRole(serverRole), { replace: true });
    } catch {
      setServerError("No se pudo conectar con el servidor");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openLoginPanel = () => {
    setActivePanel("login");
    setRegisterError("");
    setRegisterSuccess("");
  };

  const openRegisterPanel = () => {
    setActivePanel("register");
    setServerError("");
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

    if (!registerData.name.trim()) newErrors.name = "Este campo es obligatorio";
    if (!registerData.username.trim()) newErrors.username = "Este campo es obligatorio";

    if (!registerData.email.trim()) {
      newErrors.email = "Este campo es obligatorio";
    } else if (!emailPattern.test(registerData.email)) {
      newErrors.email = "Ingresa un correo vÃ¡lido";
    }

    if (!registerData.password.trim()) {
      newErrors.password = "Este campo es obligatorio";
    } else if (registerData.password.length < 6) {
      newErrors.password = "La contraseÃ±a debe tener al menos 6 caracteres";
    }

    if (!registerData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Este campo es obligatorio";
    } else if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseÃ±as no coinciden";
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
      const response = await fetch(apiUrl("/api/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

      if (data.accessToken) {
        const serverRole = data.role || data.user?.role || "user";
        setSession({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          role: serverRole,
          sessionId: data.sessionId,
          expiresAt: data.expiresAt,
        });
        navigate(getDefaultRouteByRole(serverRole), { replace: true });
        return;
      }

      setRegisterSuccess(data.message || "Cuenta registrada. Ya puedes iniciar sesiÃ³n.");
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
    } catch {
      setRegisterError("No se pudo conectar con el servidor");
    } finally {
      setIsRegisterSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <TopNavigation currentPage="login" />

      <div className="login-hero">
        <img src={loginHeroImage} alt="" aria-hidden="true" className="login-hero-image" />
      </div>

      <div className="login-wrapper">
        <div className="login-container">
          <div className="login-brand" aria-hidden="true">
            <img src={gymLogo} alt="" className="login-logo" />
            <span className="login-brand-text">GIMNASIO</span>
          </div>

          {reasonMessage && (
            <p className="error-text" role="alert">
              {reasonMessage}
            </p>
          )}

          {activePanel === "login" ? (
            <>
              <h2 className="login-title">INICIAR SESIÃ“N</h2>

              <form
                onSubmit={handleSubmit}
                className="login-form"
                aria-describedby={serverError ? "login-server-error" : undefined}
              >
                <label htmlFor="login-username">USUARIO</label>
                <input
                  id="login-username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={errors.username ? "input-error" : ""}
                  aria-invalid={Boolean(errors.username)}
                />
                {errors.username && (
                  <p className="error-text" role="alert">
                    {errors.username}
                  </p>
                )}

                <label htmlFor="login-email">CORREO ELECTRÃ“NICO</label>
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={errors.email ? "input-error" : ""}
                  aria-invalid={Boolean(errors.email)}
                />
                {errors.email && (
                  <p className="error-text" role="alert">
                    {errors.email}
                  </p>
                )}

                <label htmlFor="login-password">CONTRASEÃ‘A</label>
                <input
                  id="login-password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={errors.password ? "input-error" : ""}
                  aria-invalid={Boolean(errors.password)}
                />
                {errors.password && (
                  <p className="error-text" role="alert">
                    {errors.password}
                  </p>
                )}

                <button type="submit" className="login-btn" disabled={isSubmitting} aria-busy={isSubmitting}>
                  {isSubmitting ? "INGRESANDO..." : "INICIAR"}
                </button>

                {serverError && (
                  <p id="login-server-error" className="error-text" role="alert">
                    {serverError}
                  </p>
                )}

                <button
                  type="button"
                  className="forgot-link"
                  onClick={() => navigate("/forgot-password")}
                >
                  Â¿Olvidaste tu contraseÃ±a?
                </button>
              </form>

              <div className="login-register-cta">
                <p>Â¿No tienes cuenta?</p>
                <button type="button" className="login-switch-btn" onClick={openRegisterPanel}>
                  REGISTRARME
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="login-title">REGISTRO</h2>

              <form onSubmit={handleRegisterSubmit} className="login-form">
                <label htmlFor="register-name">NOMBRE</label>
                <input
                  id="register-name"
                  type="text"
                  name="name"
                  value={registerData.name}
                  onChange={handleRegisterChange}
                  disabled={isRegisterSubmitting}
                  className={registerErrors.name ? "input-error" : ""}
                  aria-invalid={Boolean(registerErrors.name)}
                />
                {registerErrors.name && (
                  <p className="error-text" role="alert">
                    {registerErrors.name}
                  </p>
                )}

                <label htmlFor="register-username">USUARIO</label>
                <input
                  id="register-username"
                  type="text"
                  name="username"
                  value={registerData.username}
                  onChange={handleRegisterChange}
                  disabled={isRegisterSubmitting}
                  className={registerErrors.username ? "input-error" : ""}
                  aria-invalid={Boolean(registerErrors.username)}
                />
                {registerErrors.username && (
                  <p className="error-text" role="alert">
                    {registerErrors.username}
                  </p>
                )}

                <label htmlFor="register-email">CORREO ELECTRÃ“NICO</label>
                <input
                  id="register-email"
                  type="email"
                  name="email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  disabled={isRegisterSubmitting}
                  className={registerErrors.email ? "input-error" : ""}
                  aria-invalid={Boolean(registerErrors.email)}
                />
                {registerErrors.email && (
                  <p className="error-text" role="alert">
                    {registerErrors.email}
                  </p>
                )}

                <label htmlFor="register-password">CONTRASEÃ‘A</label>
                <input
                  id="register-password"
                  type="password"
                  name="password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  disabled={isRegisterSubmitting}
                  className={registerErrors.password ? "input-error" : ""}
                  aria-invalid={Boolean(registerErrors.password)}
                />
                {registerErrors.password && (
                  <p className="error-text" role="alert">
                    {registerErrors.password}
                  </p>
                )}

                <label htmlFor="register-confirm-password">CONFIRMAR CONTRASEÃ‘A</label>
                <input
                  id="register-confirm-password"
                  type="password"
                  name="confirmPassword"
                  value={registerData.confirmPassword}
                  onChange={handleRegisterChange}
                  disabled={isRegisterSubmitting}
                  className={registerErrors.confirmPassword ? "input-error" : ""}
                  aria-invalid={Boolean(registerErrors.confirmPassword)}
                />
                {registerErrors.confirmPassword && (
                  <p className="error-text" role="alert">
                    {registerErrors.confirmPassword}
                  </p>
                )}

                <button type="submit" className="login-btn" disabled={isRegisterSubmitting} aria-busy={isRegisterSubmitting}>
                  {isRegisterSubmitting ? "REGISTRANDO..." : "REGISTRARME"}
                </button>

                {registerError && (
                  <p className="error-text" role="alert">
                    {registerError}
                  </p>
                )}

                {registerSuccess && (
                  <p className="success-text" role="status" aria-live="polite">
                    {registerSuccess}
                  </p>
                )}
              </form>

              <div className="login-register-cta">
                <p>Â¿Ya tienes cuenta?</p>
                <button type="button" className="login-switch-btn" onClick={openLoginPanel}>
                  VOLVER A INICIAR SESIÃ“N
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

