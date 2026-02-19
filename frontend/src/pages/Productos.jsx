import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/main.css";

import { getProductos } from "../services/api";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

function Productos() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [productos, setProductos] = useState([]);
  const [bebidas, setBebidas] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getProductos();
        setProductos(data.productos);
        setBebidas(data.bebidas);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  return (
    <div className="maquinas-page">
      <button
        className="btn-inicio"
        onClick={() => navigate("/")}
        aria-label="Volver a inicio"
      >
        Inicio
      </button>

      <div className="maquinas-content">
        <h1 className="maquinas-title">Productos</h1>

        <p className="maquinas-descripcion">
          Equípate con productos diseñados para acompañarte en cada repetición,
          cada gota de sudor y cada meta alcanzada.
        </p>

        {loading && <Loader text="Cargando productos..." />}
        {!loading && error && <ErrorMessage message={error} />}

        {!loading && !error && (
          <div className="maquinas-galeria">
            {productos.map((item) => (
              <div key={item.id} className="maquina-card">
                <div className="maquina-box">
                  <p>{item.descripcion}</p>
                </div>
                <span className="maquina-titulo">{item.nombre}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="maquinas-content">
        <h1 className="maquinas-title">Bebidas</h1>

        <p className="maquinas-descripcion">
          Bebidas pensadas para hidratarte antes, durante y después del
          entrenamiento.
        </p>

        {!loading && !error && (
          <div className="maquinas-galeria">
            {bebidas.map((item) => (
              <div key={item.id} className="maquina-card">
                <div className="maquina-box">
                  <p>{item.descripcion}</p>
                </div>
                <span className="maquina-titulo">{item.nombre}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Productos;
