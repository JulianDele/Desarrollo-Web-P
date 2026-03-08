import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Maquinas from "./pages/Maquinas";
import Servicios from "./pages/Servicios";
import Productos from "./pages/Productos";
import Ubicacion from "./pages/Ubicacion";
import RoleDashboard from "./pages/RoleDashboard";
import NotFound from "./pages/NotFound";
import ServerError from "./pages/ServerError";

import AdminLayout from "./admin/components/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import GestionServicios from "./admin/pages/GestionServicios";
import GestionProductos from "./admin/pages/GestionProductos";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/maquinas" element={<Maquinas />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/ubicacion" element={<Ubicacion />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <RoleDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["admin"]}>
                <AdminLayout />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="servicios" element={<GestionServicios />} />
          <Route path="productos" element={<GestionProductos />} />
        </Route>

        <Route path="/ServerError" element={<ServerError />} />
        <Route path="/NotFound" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
