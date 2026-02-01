import { Link, useLocation } from "react-router-dom";

export default function Breadcrumbs() {
  const location = useLocation();
  const paths = location.pathname.split("/").filter(Boolean);

  return (
    <nav
      aria-label="Breadcrumb"
      style={{ marginBottom: "15px" }}
    >
      <Link to="/">Inicio</Link>

      {paths.map((p, i) => {
        const route = "/" + paths.slice(0, i + 1).join("/");

        return (
          <span key={i}>
            {" / "}
            <Link to={route}>{p}</Link>
          </span>
        );
      })}
    </nav>
  );
}
