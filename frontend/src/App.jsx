import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Home from "./pages/Home";
import Maquinas from "./pages/Maquinas";
import Servicios from "./pages/Servicios";
import Productos from "./pages/Productos";
import Ubicacion from "./pages/Ubicacion";
import MenuOverlay from "./components/MenuOverlay";

import AdminLogin from "./admin/pages/AdminLogin";
import AdminRegister from "./admin/pages/AdminRegister";

import AdminLayout from "./admin/components/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import GestionServicios from "./admin/pages/GestionServicios";
import GestionProductos from "./admin/pages/GestionProductos";

import NotFound from "./pages/NotFound";
import ServerError from "./pages/ServerError";

function App() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <Router>
      {menuAbierto && <MenuOverlay cerrarMenu={() => setMenuAbierto(false)} />}

      <Routes>
        <Route
          path="/"
          element={
            <Home
              menuAbierto={menuAbierto}
              setMenuAbierto={setMenuAbierto}
            />
          }
        />
        <Route path="/maquinas" element={<Maquinas />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/ubicacion" element={<Ubicacion />} />

        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/registro" element={<AdminRegister />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="servicios" element={<GestionServicios />} />
          <Route path="productos" element={<GestionProductos />} />
        </Route>

        <Route path="/NotFound" element={<NotFound />} />
        <Route path="/ServerError" element={<ServerError />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
