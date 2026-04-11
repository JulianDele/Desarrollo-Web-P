import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi, beforeEach } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import RoleDashboard from "../pages/RoleDashboard/RoleDashboard";
import * as session from "../auth/session";

/**
 * Tests de RoleDashboard
 *
 * Nota: setSession espera { accessToken, role } — no { token, role }.
 * Los tests anteriores usaban "token" en lugar de "accessToken", lo que
 * hacía que la sesión nunca se guardara correctamente y todos los casos
 * que dependían del rol fallaban silenciosamente.
 *
 * Comportamiento esperado por rol:
 *  - recepcionista → muestra "Panel de Recepción"
 *  - cliente       → muestra "Panel de Cliente"
 *  - admin         → redirige a /admin/dashboard
 *  - guest / sin sesión → redirige a /login
 *
 * UX de autorización:
 *  - ?reason=expired  → muestra mensaje de sesión expirada
 *  - ?reason=forbidden → muestra mensaje de acceso denegado
 */

describe("RoleDashboard", () => {

  afterEach(() => {
    session.clearSession();
  });

  // ── Renders por rol ──────────────────────────────────────────────────

  it("muestra el panel de recepcionista para role recepcionista", () => {
    // FIX: usar accessToken, no token
    setSession({ accessToken: "valid-token", role: "recepcionista" });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route path="/dashboard" element={<RoleDashboard />} />
        </Routes>
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: /panel de recepción/i })
    ).not.toBeNull();
  });

  it("muestra el panel de cliente para role cliente", () => {
    setSession({ accessToken: "valid-token", role: "cliente" });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route path="/dashboard" element={<RoleDashboard />} />
        </Routes>
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: /panel de cliente/i })
    ).not.toBeNull();
  });

  // ── Redirecciones ────────────────────────────────────────────────────

  it("redirige al login si no hay sesión activa", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route path="/dashboard" element={<RoleDashboard />} />
          <Route path="/login" element={<div>Login View</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Login View")).not.toBeNull();
  });

  it("redirige al admin/dashboard si el rol es admin", () => {
    setSession({ accessToken: "valid-token", role: "admin" });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route path="/dashboard" element={<RoleDashboard />} />
          <Route path="/admin/dashboard" element={<div>Admin Dashboard</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Admin Dashboard")).not.toBeNull();
  });

  it("redirige al inicio si el rol es guest", () => {
    setSession({ accessToken: "valid-token", role: "guest" });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route path="/dashboard" element={<RoleDashboard />} />
          <Route path="/" element={<div>Home View</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Home View")).not.toBeNull();
  });

  // ── UX de autorización: mensajes 401 / 403 ───────────────────────────

  it("muestra mensaje de sesión expirada cuando ?reason=expired", () => {
    setSession({ accessToken: "valid-token", role: "cliente" });

    render(
      <MemoryRouter initialEntries={["/dashboard?reason=expired"]}>
        <Routes>
          <Route path="/dashboard" element={<RoleDashboard />} />
        </Routes>
      </MemoryRouter>
    );

    expect(
      screen.getByRole("alert")
    ).not.toBeNull();

    expect(
      screen.getByText(/tu sesión expiró/i)
    ).not.toBeNull();
  });

  it("muestra mensaje de acceso denegado cuando ?reason=forbidden", () => {
    setSession({ accessToken: "valid-token", role: "cliente" });

    render(
      <MemoryRouter initialEntries={["/dashboard?reason=forbidden"]}>
        <Routes>
          <Route path="/dashboard" element={<RoleDashboard />} />
        </Routes>
      </MemoryRouter>
    );

    expect(
      screen.getByText(/no tienes permisos/i)
    ).not.toBeNull();
  });

  it("no muestra ningún aviso cuando no hay ?reason=", () => {
    setSession({ accessToken: "valid-token", role: "cliente" });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route path="/dashboard" element={<RoleDashboard />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByRole("alert")).toBeNull();
  });
});