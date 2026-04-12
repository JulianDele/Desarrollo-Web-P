import { clearSession, fetchWithAuth } from "../auth/session";

function Navbar({ onToggleMenu, menuAbierto, menuId, menuButtonRef }) {
  const handleLogout = async () => {
    try {
      await fetchWithAuth("/api/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error(error);
    }

    clearSession();
    window.location.href = "/login";
  };

  return (
    <nav className="navbar">
      <button
        type="button"
        className="menu-btn"
        ref={menuButtonRef}
        onClick={onToggleMenu}
        aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
        aria-haspopup="dialog"
        aria-expanded={menuAbierto}
        aria-controls={menuId}
      >
        ☰
      </button>

      <button type="button" className="logout-btn" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </nav>
  );
}

export default Navbar;
