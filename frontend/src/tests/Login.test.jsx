import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Login from "../pages/Login/Login";
import * as session from "../auth/session";

function renderLogin(initialPath = "/login") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Login />
    </MemoryRouter>
  );
}

describe("Login — estados de accesibilidad y UX", () => {

  afterEach(() => {
    session.clearSession();
    vi.restoreAllMocks();
  });

  // ── Validación de campos ─────────────────────────────────────────────

  it("muestra errores de campo obligatorio como alerts al intentar enviar vacío", async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByRole("button", { name: /iniciar/i }));

    expect(screen.getAllByText("Este campo es obligatorio").length).toBe(3);
    expect(screen.getAllByRole("alert").length).toBeGreaterThanOrEqual(3);
  });

  // ── Estado de carga ──────────────────────────────────────────────────

  it("muestra loader y deshabilita el botón mientras se envía el formulario", async () => {
    const user = userEvent.setup();

    // FIX: usar una Promise controlada correctamente
    let resolveFetch;
    const pendingFetch = new Promise((resolve) => {
      resolveFetch = resolve;
    });

    vi.stubGlobal("fetch", vi.fn(() => pendingFetch));
    renderLogin();

    await user.type(screen.getByLabelText(/nombre de usuario/i), "admin");
    await user.type(screen.getByLabelText(/correo electronico/i), "admin@mail.com");
    await user.type(screen.getByLabelText(/contraseña/i), "123456");

    await user.click(screen.getByRole("button", { name: /iniciar/i }));

    // Mientras el fetch está pendiente, loader y botón deshabilitado deben estar visibles
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ingresando/i })).toBeDisabled();

    // FIX: resolver el fetch con un objeto que tenga .status para evitar el crash en Login
    resolveFetch({
      ok: false,
      status: 400,
      json: async () => ({ message: "Credenciales inválidas" }),
    });

    // Esperar a que el mensaje de error aparezca después de resolver
    expect(await screen.findByText("Credenciales inválidas")).toBeInTheDocument();
  });

  // ── Mensajes de razón de redirección ────────────────────────────────

  it("muestra mensaje de sesión expirada cuando viene de ?reason=expired", () => {
    renderLogin("/login?reason=expired");

    expect(
      screen.getByText(/tu sesión ha expirado/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("alert")
    ).toBeInTheDocument();
  });

  it("muestra mensaje de acceso denegado cuando viene de ?reason=forbidden", () => {
    renderLogin("/login?reason=forbidden");

    expect(
      screen.getByText(/no tienes permisos/i)
    ).toBeInTheDocument();
  });

  it("no muestra ningún aviso cuando no hay ?reason=", () => {
    renderLogin();

    // No debe haber ningún role="alert" al cargar sin reason
    expect(screen.queryByRole("alert")).toBeNull();
  });

  // ── Redirección si ya hay sesión activa ──────────────────────────────

  it("redirige si ya existe una sesión activa al cargar la página", () => {
    vi.spyOn(session, "getSession").mockReturnValue({
      token: "existing-token",
      role: "cliente",
    });

    // getDefaultRouteByRole("cliente") → "/dashboard"
    // La redirección ocurre en el useEffect, el componente no se renderiza
    renderLogin();

    // El formulario no debe estar presente
    expect(screen.queryByRole("button", { name: /iniciar/i })).toBeNull();
  });
});