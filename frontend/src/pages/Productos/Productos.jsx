import "./Productos.css";
import TopNavigation from "../../components/TopNavigation";
import useScrollReveal from "../../hooks/useScrollReveal";

const PRODUCTOS_CATALOGO = [
  {
    id: "producto-1",
    descripcion:
      "Suplemento que ayuda a aumentar la fuerza y mejorar el rendimiento.",
    precio: "$499",
    stock: 18,
    imageUrl: "",
  },
  {
    id: "producto-2",
    descripcion: "Suplemento proteico que apoya la recuperación muscular.",
    precio: "$649",
    stock: 12,
    imageUrl: "",
  },
  {
    id: "producto-3",
    descripcion:
      "Suplemento formulado para aumentar la energía y la intensidad.",
    precio: "$539",
    stock: 9,
    imageUrl: "",
  },
];

const BEBIDAS_CATALOGO = [
  {
    id: "bebida-1",
    descripcion:
      "Bebida energética diseñada para hidratar y potenciar tu rendimiento.",
    precio: "$45",
    stock: 34,
    imageUrl: "",
  },
  {
    id: "bebida-2",
    descripcion:
      "Bebida proteica ideal para apoyar la recuperación después del entrenamiento.",
    precio: "$52",
    stock: 21,
    imageUrl: "",
  },
  {
    id: "bebida-3",
    descripcion:
      "Bebida funcional que ayuda a mantener la energía y el enfoque durante el ejercicio.",
    precio: "$48",
    stock: 26,
    imageUrl: "",
  },
];

function Productos() {
  useScrollReveal();

  const renderCatalogo = (catalogo) => (
    <div className="productos-catalogo-grid">
      {catalogo.map((item, index) => (
        <article
          key={item.id}
          className="producto-card scroll-reveal scroll-reveal-up"
          style={{ "--reveal-delay": `${index * 85}ms` }}
        >
          <div className="producto-media">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.descripcion} loading="lazy" />
            ) : (
              <div className="producto-placeholder" aria-hidden="true">
                <i className="fas fa-image"></i>
              </div>
            )}
          </div>

          <div className="producto-body">
            <p className="producto-descripcion">{item.descripcion}</p>

            <div className="producto-meta">
              <span className="producto-precio">Precio: {item.precio}</span>
              <span className="producto-stock">Stock: {item.stock}</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );

  return (
    <div className="productos-page with-global-topbar">
      <TopNavigation currentPage="productos" />

      <section className="productos-section">
        <header className="productos-header scroll-reveal">
          <h1 className="productos-title">Productos</h1>
          <p className="productos-descripcion">
            Equípate con productos diseñados para acompañarte en cada repetición,
            cada gota de sudor y cada meta alcanzada. Entrena más fuerte, más
            seguro y más inteligente. Tu mejor versión comienza aquí.
          </p>
        </header>

        {renderCatalogo(PRODUCTOS_CATALOGO)}
      </section>

      <section className="productos-section">
        <header className="productos-header scroll-reveal">
          <h2 className="productos-title">Bebidas</h2>
          <p className="productos-descripcion">
            Bebidas pensadas para hidratarte, recuperar energía y acompañarte
            antes, durante y después de tu entrenamiento. Refresca tu esfuerzo y
            sigue avanzando.
          </p>
        </header>

        {renderCatalogo(BEBIDAS_CATALOGO)}
      </section>
    </div>
  );
}

export default Productos;
