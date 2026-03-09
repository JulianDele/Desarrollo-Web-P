import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import TopNavigation from "../components/TopNavigation";

function LocationProbe() {
  const location = useLocation();

  return (
    <p data-testid="location-probe">
      {location.pathname}
      {location.hash}
    </p>
  );
}

function renderTopNavigation() {
  return render(
    <MemoryRouter initialEntries={["/servicios"]}>
      <TopNavigation currentPage="servicios" />
      <Routes>
        <Route path="*" element={<LocationProbe />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("TopNavigation keyboard support", () => {
  it("moves focus between options with arrow keys", async () => {
    const user = userEvent.setup();
    renderTopNavigation();

    const inicioButton = screen.getByRole("button", { name: "INICIO" });
    const conocenosButton = screen.getByRole("button", { name: "CONÓCENOS" });

    inicioButton.focus();
    await user.keyboard("{ArrowRight}");

    expect(conocenosButton).toHaveFocus();
  });

  it("navigates with Alt+1 shortcut", () => {
    renderTopNavigation();
    fireEvent.keyDown(window, { key: "1", altKey: true });

    expect(screen.getByTestId("location-probe")).toHaveTextContent("/");
  });
});
