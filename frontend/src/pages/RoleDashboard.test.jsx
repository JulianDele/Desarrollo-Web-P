import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import RoleDashboard from "./RoleDashboard";
import { clearSession, setSession } from "../auth/session";

describe("RoleDashboard", () => {
  afterEach(() => {
    clearSession();
  });

  it("renders receptionist panel for recepcionista role", () => {
    setSession({ token: "valid-token", role: "recepcionista" });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route path="/dashboard" element={<RoleDashboard />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /panel de recepción/i })).not.toBeNull();
  });

  it("redirects guests without session to login", () => {
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
});
