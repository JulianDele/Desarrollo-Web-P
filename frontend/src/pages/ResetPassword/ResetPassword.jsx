import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./ResetPassword.css";
import gymLogo from "../../assets/gym.png";
import TopNavigation from "../../components/TopNavigation";
import { usePasswordPolicy } from "../../auth/usePasswordPolicy";
import { apiUrl } from "../../auth/session";

/**
 * Estados:
 * validating | invalid_token | expired_token | ready | submitting | success | network_error
 */
function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("validating");
  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const passwordInputRef = useRef(null);
  const headingRef = useRef(null);

  const { valid: policyValid, rules: policyRules } = usePasswordPolicy(formData.password);

  useEffect(() => {
    const validateToken = async () => {
      if (!token || token.length < 10) {
        setStatus("invalid_token");
        return;
      }

      const tokenPattern = /^[a-zA-Z0-9\-_]{10,}$/;
      if (!tokenPattern.test(token)) {
        setStatus("invalid_token");
        return;
      }

      setStatus("validating");

      try {
        const res = await fetch(apiUrl("/api/reset-password/validate"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json().catch(() => ({}));
        if (res.ok && data.valid) {
          setStatus("ready");
          return;
        }

        setStatus("expired_token");
      } catch {
        setStatus("network_error");
      }
    };

    validateToken();
  }, [token]);

  useEffect(() => {
    if (status !== "validating" && status !== "submitting") {
      headingRef.current?.focus();
    }
    if (status === "ready") {
      setTimeout(() => passwordInputRef.current?.focus(), 50);
    }
  }, [status]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const errors = {};

    if (!formData.password) {
      errors.password = "Este campo es obligatorio";
    } else if (!policyValid) {
      errors.password = "La contraseña no cumple con los requisitos";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Este campo es obligatorio";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      passwordInputRef.current?.focus();
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);
    setStatus("submitting");

    try {
      const response = await fetch(apiUrl("/api/reset-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: formData.password }),
      });

      if (response.status === 400) {
        setStatus("expired_token");
        return;
      }

      if (!response.ok) {
        setStatus("network_error");
        return;
      }

      setStatus("success");
    } catch {
      setStatus("network_error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rp-page">
      <TopNavigation currentPage="login" />

      <div className="rp-background" aria-hidden="true"></div>
      <div className="rp-overlay" aria-hidden="true"></div>

      <header className="rp-header">
        <div className="rp-brand">
          <img src={gymLogo} alt="Gimnasio" className="rp-logo-icon" />
          <span className="rp-logo-text">GIMNASIO</span>
        </div>
        <button
          type="button"
          className="rp-back-btn"
          onClick={() => navigate("/login")}
          aria-label="Volver al inicio de sesión"
        >
          ← VOLVER
        </button>
      </header>

      <main className="rp-wrapper" id="main-content">
        <div className="rp-container" role="region" aria-label="Restablecer contraseña">
          {status === "validating" && (
            <div className="rp-validating" aria-live="polite" aria-atomic="true">
              <div className="rp-loader" aria-hidden="true"></div>
              <p>Validando enlace...</p>
            </div>
          )}

          {status === "invalid_token" && (
            <div className="rp-status-card rp-status-card--warning">
              <span className="rp-status-icon" aria-hidden="true">
                ⚠
              </span>
              <h1 className="rp-title" tabIndex={-1} ref={headingRef}>
                Enlace inválido
              </h1>
              <p className="rp-description">
                El enlace no es válido. Solicita uno nuevo para restablecer tu contraseña.
              </p>
              <button
                type="button"
                className="rp-btn rp-btn--primary"
                onClick={() => navigate("/forgot-password")}
              >
                SOLICITAR NUEVO ENLACE
              </button>
            </div>
          )}

          {status === "expired_token" && (
            <div className="rp-status-card rp-status-card--warning">
              <span className="rp-status-icon" aria-hidden="true">
                ⏱
              </span>
              <h1 className="rp-title" tabIndex={-1} ref={headingRef}>
                Enlace expirado
              </h1>
              <p className="rp-description">
                El enlace ya expiró o fue utilizado. Solicita uno nuevo para continuar.
              </p>
              <button
                type="button"
                className="rp-btn rp-btn--primary"
                onClick={() => navigate("/forgot-password")}
              >
                SOLICITAR NUEVO ENLACE
              </button>
            </div>
          )}

          {status === "network_error" && (
            <div className="rp-status-card rp-status-card--error">
              <span className="rp-status-icon" aria-hidden="true">
                ⚠
              </span>
              <h1 className="rp-title" tabIndex={-1} ref={headingRef}>
                Error de conexión
              </h1>
              <p className="rp-description">No se pudo conectar con el servidor. Intenta de nuevo.</p>
              <button
                type="button"
                className="rp-btn rp-btn--primary"
                onClick={() => window.location.reload()}
              >
                REINTENTAR
              </button>
            </div>
          )}

          {status === "success" && (
            <div className="rp-status-card rp-status-card--success">
              <span className="rp-status-icon" aria-hidden="true">
                ✓
              </span>
              <h1 className="rp-title" tabIndex={-1} ref={headingRef}>
                Contraseña actualizada
              </h1>
              <p className="rp-description">Ya puedes iniciar sesión con tu nueva contraseña.</p>
              <button
                type="button"
                className="rp-btn rp-btn--primary"
                onClick={() => navigate("/login")}
              >
                IR A INICIAR SESIÓN
              </button>
            </div>
          )}

          {(status === "ready" || status === "submitting") && (
            <>
              <div className="rp-icon-wrap" aria-hidden="true">
                🔒
              </div>
              <h1 className="rp-title" tabIndex={-1} ref={headingRef}>
                Restablecer contraseña
              </h1>
              <p className="rp-description">Crea una contraseña nueva para tu cuenta.</p>

              <form className="rp-form" onSubmit={handleSubmit} noValidate>
                <label htmlFor="rp-password" className="rp-label">
                  NUEVA CONTRASEÑA
                </label>
                <div className="rp-input-wrap">
                  <input
                    ref={passwordInputRef}
                    id="rp-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Mínimo 8 caracteres"
                    autoComplete="new-password"
                    disabled={isSubmitting}
                    className={`rp-input${fieldErrors.password ? " rp-input--error" : ""}`}
                    aria-invalid={Boolean(fieldErrors.password)}
                    aria-describedby={[
                      fieldErrors.password ? "rp-password-error" : null,
                      formData.password ? "rp-policy" : null,
                    ]
                      .filter(Boolean)
                      .join(" ") || undefined}
                    aria-required="true"
                  />
                  <button
                    type="button"
                    className="rp-toggle-pw"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? "🙈" : "👁"}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p id="rp-password-error" className="rp-field-error" role="alert">
                    {fieldErrors.password}
                  </p>
                )}

                {formData.password.length > 0 && (
                  <ul id="rp-policy" className="rp-policy-list" aria-label="Requisitos de contraseña">
                    {policyRules.map((rule) => (
                      <li
                        key={rule.id}
                        className={`rp-policy-item${rule.met ? " rp-policy-item--met" : ""}`}
                        aria-label={`${rule.label}: ${rule.met ? "cumplido" : "pendiente"}`}
                      >
                        <span className="rp-policy-dot" aria-hidden="true">
                          {rule.met ? "✓" : "○"}
                        </span>
                        {rule.label}
                      </li>
                    ))}
                  </ul>
                )}

                <label htmlFor="rp-confirm" className="rp-label">
                  CONFIRMAR CONTRASEÑA
                </label>
                <div className="rp-input-wrap">
                  <input
                    id="rp-confirm"
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repite tu contraseña"
                    autoComplete="new-password"
                    disabled={isSubmitting}
                    className={`rp-input${fieldErrors.confirmPassword ? " rp-input--error" : ""}`}
                    aria-invalid={Boolean(fieldErrors.confirmPassword)}
                    aria-describedby={fieldErrors.confirmPassword ? "rp-confirm-error" : undefined}
                    aria-required="true"
                  />
                  <button
                    type="button"
                    className="rp-toggle-pw"
                    onClick={() => setShowConfirm((v) => !v)}
                    aria-label={showConfirm ? "Ocultar confirmación" : "Mostrar confirmación"}
                  >
                    {showConfirm ? "🙈" : "👁"}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <p id="rp-confirm-error" className="rp-field-error" role="alert">
                    {fieldErrors.confirmPassword}
                  </p>
                )}

                <button
                  type="submit"
                  className="rp-btn rp-btn--primary"
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                >
                  {isSubmitting ? "GUARDANDO..." : "CAMBIAR CONTRASEÑA"}
                </button>

                {isSubmitting && (
                  <div className="rp-loader-wrapper" role="status" aria-live="polite" aria-atomic="true">
                    <div className="rp-loader-spin" aria-hidden="true"></div>
                    <span className="rp-loader-text">Guardando contraseña...</span>
                    <span className="sr-only">Cargando</span>
                  </div>
                )}
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default ResetPassword;
