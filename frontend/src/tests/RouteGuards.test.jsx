import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../routes/ProtectedRoute";
import RoleRoute from "../routes/RoleRoute";
import { clearSession, setSession } from "../auth/session";

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
  afterEach(() => {
    clearSession();
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
    setSession({ token: "valid-token", role: "cliente" });

    render(
      <MemoryRouter initialEntries={["/private"]}>
        <AppUnderTest />
      </MemoryRouter>
    );

    expect(screen.getByText("Private View")).not.toBeNull();
  });

  it("redirects non-admin roles away from admin routes", () => {
    setSession({ token: "valid-token", role: "cliente" });

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <AppUnderTest />
      </MemoryRouter>
    );

    expect(screen.getByText("User Dashboard")).not.toBeNull();
  });

  it("allows admin role into admin routes", () => {
    setSession({ token: "valid-token", role: "admin" });

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <AppUnderTest />
      </MemoryRouter>
    );

    expect(screen.getByText("Admin View")).not.toBeNull();
  });
});
