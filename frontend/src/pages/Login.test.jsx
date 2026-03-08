import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";
import { clearSession } from "../auth/session";
import { loginUser } from "../services/api";

vi.mock("../services/api", () => ({
  loginUser: vi.fn(),
}));

function renderLogin() {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
}

describe("Login accessibility states", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    clearSession();
  });

  it("shows required field errors as alerts", async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByRole("button", { name: /iniciar/i }));

    expect(screen.getAllByText("Este campo es obligatorio").length).toBe(3);
    expect(screen.getAllByRole("alert").length).toBeGreaterThanOrEqual(3);
  });

  it("shows a loader status while submitting", async () => {
    const user = userEvent.setup();
    let rejectLogin;
    const pendingRequest = new Promise((_, reject) => {
      rejectLogin = reject;
    });

    loginUser.mockImplementation(() => pendingRequest);
    renderLogin();

    await user.type(screen.getByLabelText(/nombre de usuario/i), "admin");
    await user.type(screen.getByLabelText(/correo electronico/i), "admin@mail.com");
    await user.type(screen.getByLabelText(/contraseña/i), "123456");

    await user.click(screen.getByRole("button", { name: /iniciar/i }));

    expect(screen.getByRole("status")).not.toBeNull();
    expect(screen.getByRole("button", { name: /ingresando/i }).disabled).toBe(true);

    rejectLogin(new Error("Credenciales inválidas"));

    expect(await screen.findByText("Credenciales inválidas")).not.toBeNull();
  });
});
