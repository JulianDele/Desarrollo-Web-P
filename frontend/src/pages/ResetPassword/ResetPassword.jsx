import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./ResetPassword.css";
import gymLogo from "../../assets/gym.png";
import TopNavigation from "../../components/TopNavigation";
import { usePasswordPolicy } from "../../auth/usePasswordPolicy";

/**
 * Estados del flujo:
 *  validating      → verificando el token al montar
 *  invalid_token   → token ausente o malformado
 *  expired_token   → token válido pero expirado (400/410 del server)
 *  ready           → formulario activo
 *  submitting      → enviando nueva contraseña
 *  success         → contraseña cambiada con éxito
 *  network_error   → fallo de red
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

  // Hook de política de contraseña
  const { valid: policyValid, rules: policyRules } = usePasswordPolicy(formData.password);

  // ── Al montar: validar presencia y formato básico del token ──
  useEffect(() => {
    if (!token || token.length < 10) {
      setStatus("invalid_token");
      return;
    }
    // Validación ligera en cliente (formato UUID o similar)
    const tokenPattern = /^[a-zA-Z0-9\-_]{10,}$/;
    if (!tokenPattern.test(token)) {
      setStatus("invalid_token");
      return;
    }
    setStatus("ready");
  }, [token]);

  // Llevar el foco al heading cuando cambia el estado
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
    // Limpiar error del campo al escribir
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
      // Foco al primer campo con error
      if (errors.password) passwordInputRef.current?.focus();
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);
    setStatus("submitting");

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: formData.password }),
      });

      if (response.status === 400 || response.status === 410) {
        // Token expirado o ya usado
        setStatus("expired_token");
        return;
      }

      if (response.status === 404) {
        setStatus("invalid_token");
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
        <div className="rp-container" role="region" aria-label="Cambiar contraseña">

          {/* Región aria-live para cambios de estado */}
          <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
          >
            {status === "success" && "Contraseña cambiada con éxito."}
            {status === "expired_token" && "El enlace ha expirado. Solicita uno nuevo."}
            {status === "invalid_token" && "El enlace no es válido."}
            {status === "network_error" && "Error de conexión. Intenta de nuevo."}
            {status === "submitting" && "Guardando nueva contraseña..."}
          </div>

          {/* ── Validando token ── */}
          {status === "validating" && (
            <div className="rp-validating" role="status" aria-live="polite">
              <div className="rp-loader" aria-hidden="true"></div>
              <p>Verificando enlace...</p>
            </div>
          )}

          {/* ── Token inválido ── */}
          {status === "invalid_token" && (
            <div className="rp-status-card rp-status-card--error">
              <div className="rp-status-icon" aria-hidden="true">✕</div>
              <h1
                ref={headingRef}
                className="rp-title"
                tabIndex={-1}
              >
                ENLACE INVÁLIDO
              </h1>
              <p className="rp-description">
                Este enlace no es válido o ya fue utilizado. Solicita uno nuevo
                desde la pantalla de recuperación.
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

          {/* ── Token expirado ── */}
          {status === "expired_token" && (
            <div className="rp-status-card rp-status-card--warning">
              <div className="rp-status-icon" aria-hidden="true">⏱</div>
              <h1
                ref={headingRef}
                className="rp-title"
                tabIndex={-1}
              >
                ENLACE EXPIRADO
              </h1>
              <p className="rp-description">
                Este enlace de restablecimiento ya expiró. Los enlaces son
                válidos por un tiempo limitado por razones de seguridad.
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

          {/* ── Éxito ── */}
          {status === "success" && (
            <div className="rp-status-card rp-status-card--success">
              <div className="rp-status-icon" aria-hidden="true">✓</div>
              <h1
                ref={headingRef}
                className="rp-title"
                tabIndex={-1}
              >
                CONTRASEÑA ACTUALIZADA
              </h1>
              <p className="rp-description">
                Tu contraseña ha sido cambiada con éxito. Ya puedes iniciar
                sesión con tu nueva contraseña.
              </p>
              <button
                type="button"
                className="rp-btn rp-btn--primary"
                onClick={() => navigate("/login")}
              >
                INICIAR SESIÓN
              </button>
            </div>
          )}

          {/* ── Error de red ── */}
          {status === "network_error" && (
            <div className="rp-status-card rp-status-card--error">
              <div className="rp-status-icon" aria-hidden="true">⚠</div>
              <h1
                ref={headingRef}
                className="rp-title"
                tabIndex={-1}
              >
                ERROR DE CONEXIÓN
              </h1>
              <p className="rp-description">
                No se pudo guardar la contraseña. Verifica tu conexión e
                intenta de nuevo.
              </p>
              <button
                type="button"
                className="rp-btn rp-btn--primary"
                onClick={() => setStatus("ready")}
              >
                INTENTAR DE NUEVO
              </button>
            </div>
          )}

          {/* ── Formulario (ready / submitting) ── */}
          {(status === "ready" || status === "submitting") && (
            <>
              <div className="rp-icon-wrap" aria-hidden="true">🔒</div>
              <h1
                ref={headingRef}
                className="rp-title"
                tabIndex={-1}
              >
                NUEVA CONTRASEÑA
              </h1>
              <p className="rp-description">
                Crea una contraseña segura para tu cuenta.
              </p>

              <form
                onSubmit={handleSubmit}
                className="rp-form"
                noValidate
              >
                {/* ── Campo nueva contraseña ── */}
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
                    placeholder="Crea tu contraseña"
                    autoComplete="new-password"
                    disabled={isSubmitting}
                    className={`rp-input${fieldErrors.password ? " rp-input--error" : ""}`}
                    aria-invalid={Boolean(fieldErrors.password)}
                    aria-describedby={
                      [
                        fieldErrors.password ? "rp-password-error" : null,
                        "rp-policy",
                      ]
                        .filter(Boolean)
                        .join(" ") || undefined
                    }
                    aria-required="true"
                  />
                  <button
                    type="button"
                    className="rp-toggle-pw"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    tabIndex={0}
                  >
                    {showPassword ? "🙈" : "👁"}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p id="rp-password-error" className="rp-field-error" role="alert">
                    {fieldErrors.password}
                  </p>
                )}

                {/* ── Indicador de política de contraseña ── */}
                {formData.password.length > 0 && (
                  <ul
                    id="rp-policy"
                    className="rp-policy-list"
                    aria-label="Requisitos de contraseña"
                  >
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

                {/* ── Campo confirmar contraseña ── */}
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
                    aria-describedby={
                      fieldErrors.confirmPassword ? "rp-confirm-error" : undefined
                    }
                    aria-required="true"
                  />
                  <button
                    type="button"
                    className="rp-toggle-pw"
                    onClick={() => setShowConfirm((v) => !v)}
                    aria-label={showConfirm ? "Ocultar confirmación" : "Mostrar confirmación"}
                    tabIndex={0}
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
                  <div
                    className="rp-loader-wrapper"
                    role="status"
                    aria-live="polite"
                    aria-atomic="true"
                  >
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