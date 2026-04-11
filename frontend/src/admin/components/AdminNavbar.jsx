import { clearSession, fetchWithAuth } from "../../auth/session";

export default function AdminNavbar() {
  const handleLogout = async () => {
    try {
      await fetchWithAuth("/api/logout", {
        method: "POST",
      });
    } catch {
      console.warn("No se pudo cerrar sesión en servidor");
    }

    clearSession();
    window.location.href = "/login";
  };

  return (
    <div className="admin-navbar">
      <span className="navbar-title">Administración del Gimnasio</span>

      <button
        className="logout-btn"
        onClick={handleLogout}
        aria-label="Cerrar sesión"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
