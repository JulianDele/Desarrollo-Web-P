import AdminCrudPanel from "../components/AdminCrudPanel";
import { serviceSeed } from "../data/seedData";

export default function GestionServicios() {
  return (
    <AdminCrudPanel
      title="Gestion de Servicios"
      storageKey="admin-services"
      seedItems={serviceSeed}
      quantityLabel="Cupos"
      emptyMessage="No hay servicios registrados."
    />
  );
}
