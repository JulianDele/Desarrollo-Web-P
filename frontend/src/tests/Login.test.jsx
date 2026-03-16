import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Login from "../pages/Login/Login";

function renderLogin() {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
}

describe("Login accessibility states", () => {
  afterEach(() => {
    vi.restoreAllMocks();
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

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ingresando/i })).toBeDisabled();

    resolveFetch({
      ok: false,
      json: async () => ({ message: "Credenciales inválidas" }),
    });

    expect(await screen.findByText("Credenciales inválidas")).toBeInTheDocument();
  });
});
