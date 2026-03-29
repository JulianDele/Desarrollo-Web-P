import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import gymLogo from "../../assets/gym.png";
import TopNavigation from "../../components/TopNavigation";


function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | sent | network_error
  const [isSubmitting, setIsSubmitting] = useState(false);

  const liveRegionRef = useRef(null);
  const emailInputRef = useRef(null);

  // Foco inicial al montar
  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  const validateEmail = (value) => {
    if (!value.trim()) return "Este campo es obligatorio";
    if (!/\S+@\S+\.\S+/.test(value)) return "Ingresa un correo válido";
    return "";
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    // Limpiar error inline al escribir
    if (fieldError) setFieldError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevenir doble envío
    if (isSubmitting) return;

    const error = validateEmail(email);
    if (error) {
      setFieldError(error);
      emailInputRef.current?.focus();
      return;
    }

    setFieldError("");
    setIsSubmitting(true);
    setStatus("submitting");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      // Respuesta 200 o 404: siempre mostramos el mismo mensaje neutro
      // para no confirmar si el email existe en la base de datos.
      if (response.ok || response.status === 404) {
        setStatus("sent");
        return;
      }

      // Error inesperado del servidor (500, etc.)
      setStatus("network_error");
    } catch {
      // Error de red / sin conexión
      setStatus("network_error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setStatus("idle");
    setEmail("");
    setFieldError("");
    // Foco de vuelta al input
    setTimeout(() => emailInputRef.current?.focus(), 50);
  };

  return (
    <div className="fp-page">
      <TopNavigation currentPage="login" />

      <div className="fp-background" aria-hidden="true"></div>
      <div className="fp-overlay" aria-hidden="true"></div>

      <header className="fp-header">
        <div className="fp-brand">
          <img src={gymLogo} alt="Gimnasio" className="fp-logo-icon" />
          <span className="fp-logo-text">GIMNASIO</span>
        </div>
        <button
          type="button"
          className="fp-back-btn"
          onClick={() => navigate("/login")}
          aria-label="Volver al inicio de sesión"
        >
          ← VOLVER
        </button>
      </header>

      <main className="fp-wrapper" id="main-content">
        <div className="fp-container" role="region" aria-label="Recuperar contraseña">

          {/* Región aria-live para anunciar cambios de estado a lectores de pantalla */}
          <div
            ref={liveRegionRef}
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
          >
            {status === "sent" && "Solicitud enviada. Revisa tu correo electrónico."}
            {status === "network_error" && "Error de conexión. Por favor intenta de nuevo."}
            {status === "submitting" && "Enviando solicitud..."}
          </div>

          {/* ── ESTADO: sent ── */}
          {status === "sent" && (
            <div className="fp-status-card fp-status-card--success" tabIndex={-1}>
              <div className="fp-status-icon" aria-hidden="true">✉</div>
              <h1 className="fp-title">Revisa tu correo</h1>
              <p className="fp-description">
                Si existe una cuenta asociada a ese correo, recibirás un
                enlace para restablecer tu contraseña en los próximos minutos.
              </p>
              <p className="fp-hint">
                Recuerda revisar tu carpeta de spam o correo no deseado.
              </p>
              <button
                type="button"
                className="fp-btn fp-btn--secondary"
                onClick={() => navigate("/login")}
              >
                VOLVER AL INICIO DE SESIÓN
              </button>
            </div>
          )}

          {/* ── ESTADO: network_error ── */}
          {status === "network_error" && (
            <div className="fp-status-card fp-status-card--error" tabIndex={-1}>
              <div className="fp-status-icon" aria-hidden="true">⚠</div>
              <h1 className="fp-title">Error de conexión</h1>
              <p className="fp-description">
                No se pudo conectar con el servidor. Verifica tu conexión a
                internet e intenta nuevamente.
              </p>
              <button
                type="button"
                className="fp-btn fp-btn--primary"
                onClick={handleRetry}
              >
                INTENTAR DE NUEVO
              </button>
            </div>
          )}

          {/* ── ESTADO: idle / submitting ── */}
          {(status === "idle" || status === "submitting") && (
            <>
              <div className="fp-icon-wrap" aria-hidden="true">🔑</div>
              <h1 className="fp-title">¿Olvidaste tu contraseña?</h1>
              <p className="fp-description">
                Ingresa tu correo electrónico y te enviaremos instrucciones
                para restablecerla.
              </p>

              <form
                onSubmit={handleSubmit}
                className="fp-form"
                noValidate
                aria-describedby={fieldError ? "fp-email-error" : undefined}
              >
                <label htmlFor="fp-email" className="fp-label">
                  CORREO ELECTRÓNICO
                </label>
                <input
                  ref={emailInputRef}
                  id="fp-email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
                  autoComplete="email"
                  disabled={isSubmitting}
                  className={`fp-input${fieldError ? " fp-input--error" : ""}`}
                  aria-invalid={Boolean(fieldError)}
                  aria-describedby={fieldError ? "fp-email-error" : undefined}
                  aria-required="true"
                />
                {fieldError && (
                  <p id="fp-email-error" className="fp-field-error" role="alert">
                    {fieldError}
                  </p>
                )}

                <button
                  type="submit"
                  className="fp-btn fp-btn--primary"
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                >
                  {isSubmitting ? "ENVIANDO..." : "ENVIAR INSTRUCCIONES"}
                </button>

                {isSubmitting && (
                  <div
                    className="fp-loader-wrapper"
                    role="status"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    <div className="fp-loader" aria-hidden="true"></div>
                    <span className="fp-loader-text">Procesando solicitud...</span>
                    <span className="sr-only">Cargando</span>
                  </div>
                )}
              </form>

              <div className="fp-footer-cta">
                <p>¿Recordaste tu contraseña?</p>
                <button
                  type="button"
                  className="fp-switch-btn"
                  onClick={() => navigate("/login")}
                >
                  VOLVER A INICIAR SESIÓN
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default ForgotPassword;