import { useLocation, useNavigate } from "react-router-dom";
import gymIcon from "../assets/gym.png";

const HOME_SECTION_INFO = "home-informacion";

function TopNavigation({ currentPage }) {
  const navigate = useNavigate();
  const location = useLocation();

  const goToHomeSection = (sectionId) => {
    if (location.pathname === "/") {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }

    navigate(`/#${sectionId}`);
  };

  const navItems = [
    {
      key: "inicio",
      label: "INICIO",
      onClick: () => navigate("/"),
    },
    {
      key: "conocenos",
      label: "CONÓCENOS",
      onClick: () => goToHomeSection(HOME_SECTION_INFO),
    },
    {
      key: "servicios",
      label: "SERVICIOS",
      onClick: () => navigate("/servicios"),
    },
    {
      key: "instalaciones",
      label: "INSTALACIONES",
      onClick: () => navigate("/maquinas"),
    },
    {
      key: "productos",
      label: "PRODUCTOS",
      onClick: () => navigate("/productos"),
    },
    {
      key: "ubicacion",
      label: "UBICACIÓN",
      onClick: () => navigate("/ubicacion"),
    },
  ];

  return (
    <header className="home-topbar shared-topbar">
      <button
        type="button"
        className="home-topbar-brand topbar-brand-btn"
        onClick={() => navigate("/")}
        aria-label="Ir a inicio"
      >
        <img src={gymIcon} alt="" aria-hidden="true" />
        <span>GIMNASIO</span>
      </button>

      <div className="home-topbar-content">
        <nav className="home-topbar-nav" aria-label="Navegación principal">
          {navItems
            .filter((item) => item.key !== currentPage)
            .map((item, index) => (
              <button
                type="button"
                key={item.key}
                className="home-topbar-link-btn topbar-nav-item"
                onClick={item.onClick}
                style={{ "--nav-delay": `${index * 55}ms` }}
              >
                {item.label}
              </button>
            ))}
        </nav>
      </div>
    </header>
  );
}

export default TopNavigation;
