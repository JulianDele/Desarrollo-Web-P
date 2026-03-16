import "./Ubicacion.css";
import TopNavigation from "../../components/TopNavigation";
import useScrollReveal from "../../hooks/useScrollReveal";

function Ubicacion() {
  useScrollReveal();

  return (
    <div className="ubicacion-page with-global-topbar">
      <TopNavigation currentPage="ubicacion" />

      <section className="ubicacion-contenido">
        <div className="ubicacion-info scroll-reveal scroll-reveal-left">
          <h1>UBICACIÓN</h1>

          <div className="linea-roja"></div>

          <p className="ubicacion-texto">
            NOS UBICAMOS EN CALLE CERVANTES,
            <br />
            34, MADRID, CP 28001
          </p>

          <p className="horario">
            HORARIO DE:
            <br />
            07:00 AM
            <br />A<br />
            9:00 PM
          </p>

          <div className="linea-roja"></div>

          <a
            href="https://www.google.com/maps?q=Calle+Cervantes+34+Madrid"
            target="_blank"
            rel="noreferrer"
            className="ubicacion-link"
            aria-label="Abrir ubicación en Google Maps"
          >
            ENLACE DE UBICACIÓN WWW
          </a>
        </div>

        <div className="ubicacion-mapa scroll-reveal scroll-reveal-right">
          <iframe
            title="Mapa de ubicación"
            src="https://www.google.com/maps?q=Calle+Cervantes+34+Madrid&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>

      <div className="barra-inferior"></div>
    </div>
  );
}

export default Ubicacion;
