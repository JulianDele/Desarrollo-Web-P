export default function GestionServicios() {
  return (
    <>
      <h2>Gestión de Servicios</h2>

      <form className="admin-form">
        <label htmlFor="service-name">Nombre del servicio</label>
        <input id="service-name" name="service-name" type="text" />

        <label htmlFor="service-description">Descripción</label>
        <textarea id="service-description" name="service-description" rows="3"></textarea>

        <label htmlFor="service-price">Precio</label>
        <input id="service-price" name="service-price" type="number" />

        <button type="button">Guardar servicio</button>
      </form>
    </>
  );
}
