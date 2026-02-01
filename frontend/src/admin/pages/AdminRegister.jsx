export default function AdminRegister() {
  return (
    <div className="admin-content">
      <h2>Registro Administrador</h2>

      <form className="admin-form">
        <label>Nombre</label>
        <input type="text" />

        <label>Email</label>
        <input type="email" />

        <label>Contraseña</label>
        <input type="password" />

        <button type="button">Registrar</button>
      </form>
    </div>
  );
}
