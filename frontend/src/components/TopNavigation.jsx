import { useCallback, useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import gymIcon from "../assets/gym.png";

const HOME_SECTION_INFO = "home-informacion";

function TopNavigation({ currentPage }) {
  const navigate = useNavigate();
  const location = useLocation();
  const navButtonRefs = useRef([]);

  const goToHomeSection = useCallback((sectionId) => {
    if (location.pathname === "/") {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }

    navigate(`/#${sectionId}`);
  }, [location.pathname, navigate]);

  const navItems = useMemo(
    () => [
      {
        key: "inicio",
        label: "INICIO",
        shortcut: "1",
        onClick: () => navigate("/"),
      },
      {
        key: "conocenos",
        label: "CONÓCENOS",
        shortcut: "2",
        onClick: () => goToHomeSection(HOME_SECTION_INFO),
      },
      {
        key: "servicios",
        label: "SERVICIOS",
        shortcut: "3",
        onClick: () => navigate("/servicios"),
      },
      {
        key: "instalaciones",
        label: "INSTALACIONES",
        shortcut: "4",
        onClick: () => navigate("/maquinas"),
      },
      {
        key: "productos",
        label: "PRODUCTOS",
        shortcut: "5",
        onClick: () => navigate("/productos"),
      },
      {
        key: "ubicacion",
        label: "UBICACIÓN",
        shortcut: "6",
        onClick: () => navigate("/ubicacion"),
      },
    ],
    [goToHomeSection, navigate]
  );

  const visibleNavItems = useMemo(
    () => navItems.filter((item) => item.key !== currentPage),
    [navItems, currentPage]
  );

  useEffect(() => {
    const isTypingContext = (element) => {
      if (!element) return false;
      const tagName = element.tagName;
      return (
        tagName === "INPUT" ||
        tagName === "TEXTAREA" ||
        tagName === "SELECT" ||
        element.isContentEditable
      );
    };

    const shortcuts = navItems.reduce((map, item) => {
      map[item.shortcut] = item.onClick;
      return map;
    }, {});

    const handleGlobalKeyDown = (event) => {
      if (!event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
        return;
      }

      if (isTypingContext(document.activeElement)) {
        return;
      }

      const action = shortcuts[event.key];
      if (!action) return;

      event.preventDefault();
      action();
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [navItems]);

  const handleNavKeyDown = (event, index) => {
    const items = navButtonRefs.current.filter(Boolean);
    if (items.length === 0) return;

    let nextIndex = index;

    if (event.key === "ArrowRight") {
      nextIndex = (index + 1) % items.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (index - 1 + items.length) % items.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = items.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    items[nextIndex]?.focus();
  };

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
        <nav
          className="home-topbar-nav"
          aria-label="Navegación principal"
          aria-keyshortcuts="Alt+1 Alt+2 Alt+3 Alt+4 Alt+5 Alt+6"
        >
          {visibleNavItems.map((item, index) => (
            <button
              type="button"
              key={item.key}
              ref={(element) => {
                navButtonRefs.current[index] = element;
              }}
              className="home-topbar-link-btn topbar-nav-item"
              onClick={item.onClick}
              onKeyDown={(event) => handleNavKeyDown(event, index)}
              aria-keyshortcuts={`Alt+${item.shortcut}`}
              title={`${item.label} (Alt+${item.shortcut})`}
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
