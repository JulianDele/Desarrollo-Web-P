
const POLICY = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecial: true,
};

const SPECIAL_CHARS = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

/**
 * @param {string} password
 * @returns {{ valid: boolean, rules: Array<{ id: string, label: string, met: boolean }> }}
 */
export function usePasswordPolicy(password = "") {
  const rules = [
    {
      id: "length",
      label: `Al menos ${POLICY.minLength} caracteres`,
      met: password.length >= POLICY.minLength,
    },
    {
      id: "uppercase",
      label: "Una letra mayúscula",
      met: /[A-Z]/.test(password),
    },
    {
      id: "lowercase",
      label: "Una letra minúscula",
      met: /[a-z]/.test(password),
    },
    {
      id: "number",
      label: "Un número",
      met: /[0-9]/.test(password),
    },
    {
      id: "special",
      label: "Un carácter especial (!@#$...)",
      met: SPECIAL_CHARS.test(password),
    },
  ];

  const valid = rules.every((r) => r.met);

  return { valid, rules };
}