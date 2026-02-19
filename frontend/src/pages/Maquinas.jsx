import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/main.css";

import { getMaquinas } from "../services/api";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

function Maquinas() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [maquinas, setMaquinas] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMaquinas = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getMaquinas();
        setMaquinas(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMaquinas();
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
        <h1 className="maquinas-title">Máquinas</h1>

        <p className="maquinas-descripcion">
          En esta sección encontrarás las máquinas disponibles para realizar tus
          rutinas de ejercicio según tus objetivos. Cada equipo está diseñado
          para ayudarte a entrenar de forma segura, eficiente y a tu propio
          ritmo.
        </p>

        {loading && <Loader text="Cargando máquinas disponibles..." />}
        
        {!loading && error && <ErrorMessage message={error} />}

        {!loading && !error && (
          <div className="maquinas-galeria">
            {maquinas.map((maquina) => (
              <div key={maquina.id} className="maquina-card">
                <div className="maquina-box">
                  <p>{maquina.descripcion}</p>
                </div>
                <span className="maquina-titulo">{maquina.nombre}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Maquinas;
