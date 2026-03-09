function Navbar({ onToggleMenu, menuAbierto, menuId, menuButtonRef }) {
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
    </nav>
  );
}

export default Navbar;
