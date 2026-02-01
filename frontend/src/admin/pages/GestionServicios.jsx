export default function GestionServicios() {
  return (
    <>
      <h2>Gestión de Servicios</h2>

      <form className="admin-form">
        <label>Nombre del servicio</label>
        <input type="text" />

        <label>Descripción</label>
        <textarea rows="3"></textarea>

        <label>Precio</label>
        <input type="number" />

        <button type="button">Guardar servicio</button>
      </form>
    </>
  );
}
