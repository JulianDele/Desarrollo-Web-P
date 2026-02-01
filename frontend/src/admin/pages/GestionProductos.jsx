export default function GestionProductos() {
  return (
    <>
      <h2>Gestión de Productos</h2>

      <form className="admin-form">
        <label>Nombre del producto</label>
        <input type="text" />

        <label>Descripción</label>
        <textarea rows="3"></textarea>

        <label>Precio</label>
        <input type="number" />

        <button type="button">Guardar producto</button>
      </form>
    </>
  );
}
