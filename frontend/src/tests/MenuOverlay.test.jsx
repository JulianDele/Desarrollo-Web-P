import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import MenuOverlay from "../components/MenuOverlay";

describe("MenuOverlay keyboard behavior", () => {
  it("focuses first action, supports arrow keys, and closes with Escape", async () => {
    const user = userEvent.setup();
    const closeMenu = vi.fn();
    const trigger = document.createElement("button");
    document.body.appendChild(trigger);

    render(
      <MemoryRouter>
        <MenuOverlay cerrarMenu={closeMenu} triggerRef={{ current: trigger }} />
      </MemoryRouter>
    );

    const firstAction = screen.getByRole("button", { name: /ver máquinas/i });
    const secondAction = screen.getByRole("button", { name: /ver servicios/i });

    expect(firstAction).toHaveFocus();

    await user.keyboard("{ArrowDown}");
    expect(secondAction).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(closeMenu).toHaveBeenCalledTimes(1);

    trigger.remove();
  });
});
