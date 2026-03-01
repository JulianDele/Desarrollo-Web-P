export default function GestionProductos() {
  return (
    <>
      <h2>Gestión de Productos</h2>

      <form className="admin-form">
        <label htmlFor="product-name">Nombre del producto</label>
        <input id="product-name" name="product-name" type="text" />

        <label htmlFor="product-description">Descripción</label>
        <textarea id="product-description" name="product-description" rows="3"></textarea>

        <label htmlFor="product-price">Precio</label>
        <input id="product-price" name="product-price" type="number" />

        <button type="button">Guardar producto</button>
      </form>
    </>
  );
}
