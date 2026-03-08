import { useOutletContext } from "react-router-dom";
import AdminCrudPanel from "../components/AdminCrudPanel";
import { productSeed, serviceSeed } from "../data/seedData";

export default function Dashboard() {
  const { titulo } = useOutletContext();

  return (
    <div className="admin-dashboard">
      <header className="admin-dashboard-header admin-fade-in-up">
        <h1>{titulo}</h1>
        <p>
          Desde este panel puedes administrar productos y servicios del gimnasio
          con operaciones de alta, edicion y eliminacion.
        </p>
      </header>

      <div className="admin-dashboard-grid">
        <AdminCrudPanel
          title="Productos"
          storageKey="admin-products"
          seedItems={productSeed}
          quantityLabel="Cantidad"
          emptyMessage="No hay productos registrados."
        />

        <AdminCrudPanel
          title="Servicios"
          storageKey="admin-services"
          seedItems={serviceSeed}
          quantityLabel="Cupos"
          emptyMessage="No hay servicios registrados."
        />
      </div>
    </div>
  );
}
