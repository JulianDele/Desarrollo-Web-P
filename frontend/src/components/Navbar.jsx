import "../styles/main.css";

function Navbar({ onToggleMenu }) {
  return (
    <nav className="navbar">
      <button
        className="menu-btn"
        onClick={onToggleMenu}
        aria-label="Abrir menú"
      >
        ☰
      </button>
    </nav>
  );
}

export default Navbar;
