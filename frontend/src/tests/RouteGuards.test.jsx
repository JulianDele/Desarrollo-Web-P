import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../routes/ProtectedRoute";
import RoleRoute from "../routes/RoleRoute";
import * as session from "../auth/session";

/**
 * Tests de guardas de ruta
 *
 * FIXES respecto a la versión anterior:
 *
 * 1. Async: ProtectedRoute y RoleRoute son asíncronos (llaman a fetchWithAuth).
 *    Los assertions deben usar `await waitFor()` o `findBy*` para esperar
 *    a que el estado se resuelva antes de verificar el DOM.
 *
 * 2. RoleRoute redirige en lugar de mostrar texto — el test de "blocks non-admin"
 *    anterior buscaba un texto que nunca existió. Ahora verifica la redirección.
 *
 * 3. isSessionExpired: se mockea para controlar el comportamiento local
 *    sin depender del reloj del sistema.
 */

function AppUnderTest() {
  return (
    <Routes>
      <Route path="/login" element={<div>Login View</div>} />
      <Route path="/dashboard" element={<div>User Dashboard</div>} />
      <Route path="/" element={<div>Home View</div>} />
      <Route
        path="/private"
        element={
          <ProtectedRoute>
            <div>Private View</div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["admin"]}>
              <div>Admin View</div>
            </RoleRoute>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

describe("Route guards", () => {

  beforeEach(() => {
    // Por defecto: sesión no expirada localmente
    vi.spyOn(session, "isSessionExpired").mockReturnValue(false);

    // Por defecto: backend responde 401 (no autenticado)
    vi.spyOn(session, "fetchWithAuth").mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({}),
    });
  });

  afterEach(() => {
    session.clearSession();
    vi.restoreAllMocks();
  });

  // ── ProtectedRoute ───────────────────────────────────────────────────

  it("redirige al login si no hay token local", async () => {
    // Sin sesión y sin token → cortocircuito local antes del fetch
    vi.spyOn(session, "isSessionExpired").mockReturnValue(true);

    render(
      <MemoryRouter initialEntries={["/private"]}>
        <AppUnderTest />
      </MemoryRouter>
    );

    // Esperar a que se resuelva el estado asíncrono
    await waitFor(() => {
      expect(screen.getByText("Login View")).not.toBeNull();
    });
  });

  it("permite acceso a rutas privadas con sesión válida", async () => {
    session.setSession({ accessToken: "valid-token", role: "cliente" });

    vi.spyOn(session, "fetchWithAuth").mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ user: { role: "cliente" } }),
    });

    render(
      <MemoryRouter initialEntries={["/private"]}>
        <AppUnderTest />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Private View")).not.toBeNull();
    });
  });

  it("redirige al login cuando el backend responde 401", async () => {
    session.setSession({ accessToken: "expired-token", role: "cliente" });

    // fetchWithAuth ya está mockeado a 401 en beforeEach

    render(
      <MemoryRouter initialEntries={["/private"]}>
        <AppUnderTest />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Login View")).not.toBeNull();
    });
  });

  // ── RoleRoute ────────────────────────────────────────────────────────

  it("bloquea roles no permitidos y redirige fuera de /admin", async () => {
    session.setSession({ accessToken: "valid-token", role: "cliente" });

    vi.spyOn(session, "fetchWithAuth").mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ user: { role: "cliente" } }),
    });

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <AppUnderTest />
      </MemoryRouter>
    );

    // RoleRoute redirige al dashboard del rol (no muestra texto de error)
    await waitFor(() => {
      expect(screen.getByText("User Dashboard")).not.toBeNull();
    });
  });

  it("permite acceso a /admin con rol admin", async () => {
    session.setSession({ accessToken: "valid-token", role: "admin" });

    vi.spyOn(session, "fetchWithAuth").mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ user: { role: "admin" } }),
    });

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <AppUnderTest />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Admin View")).not.toBeNull();
    });
  });

  it("redirige al login desde /admin cuando el backend responde 401", async () => {
    session.setSession({ accessToken: "expired-token", role: "admin" });

    // fetchWithAuth ya está mockeado a 401 en beforeEach

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <AppUnderTest />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Login View")).not.toBeNull();
    });
  });
});