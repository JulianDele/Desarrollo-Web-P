import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../routes/ProtectedRoute";
import RoleRoute from "../routes/RoleRoute";
import * as session from "../auth/session";

function AppUnderTest() {
  return (
    <Routes>
      <Route path="/login" element={<div>Login View</div>} />
      <Route path="/dashboard" element={<div>User Dashboard</div>} />
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

  it("redirects unauthenticated users to login for private routes", () => {
    render(
      <MemoryRouter initialEntries={["/private"]}>
        <AppUnderTest />
      </MemoryRouter>
    );

    expect(screen.getByText("Login View")).not.toBeNull();
  });

  it("allows authenticated users into private routes", () => {
    session.setSession({ accessToken: "valid-token", role: "cliente" });
    session.fetchWithAuth.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ user: { role: "cliente" } }),
    });

    render(
      <MemoryRouter initialEntries={["/private"]}>
        <AppUnderTest />
      </MemoryRouter>
    );

    expect(screen.getByText("Private View")).not.toBeNull();
  });

  it("blocks non-admin roles from admin routes", () => {
    session.setSession({ accessToken: "valid-token", role: "cliente" });
    session.fetchWithAuth.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ user: { role: "cliente" } }),
    });

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <AppUnderTest />
      </MemoryRouter>
    );

    expect(
      screen.getByText("No tienes permisos para acceder a esta sección.")
    ).not.toBeNull();
  });

  it("allows admin role into admin routes", () => {
    session.setSession({ accessToken: "valid-token", role: "admin" });
    session.fetchWithAuth.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ user: { role: "admin" } }),
    });

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <AppUnderTest />
      </MemoryRouter>
    );

    expect(screen.getByText("Admin View")).not.toBeNull();
  });
});
