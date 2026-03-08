import AdminCrudPanel from "../components/AdminCrudPanel";
import { productSeed } from "../data/seedData";

export default function GestionProductos() {
  return (
    <AdminCrudPanel
      title="Gestion de Productos"
      storageKey="admin-products"
      seedItems={productSeed}
      quantityLabel="Cantidad"
      emptyMessage="No hay productos registrados."
    />
  );
}
