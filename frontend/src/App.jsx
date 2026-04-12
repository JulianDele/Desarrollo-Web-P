import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { listenLogout } from "./auth/session";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import Maquinas from "./pages/Maquinas/Maquinas";
import Servicios from "./pages/Servicios/Servicios";
import Productos from "./pages/Productos/Productos";
import Ubicacion from "./pages/Ubicacion/Ubicacion";
import RoleDashboard from "./pages/RoleDashboard/RoleDashboard";
import NotFound from "./pages/NotFound/NotFound";
import ServerError from "./pages/ServerError/ServerError";

import AdminLayout from "./admin/components/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import GestionServicios from "./admin/pages/GestionServicios";
import GestionProductos from "./admin/pages/GestionProductos";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";

function App() {

  useEffect(() => {
    listenLogout(() => {
      window.location.href = "/login";
    });
  }, []);

  return (
    <Router>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* ── Recuperación de contraseña (rutas públicas) ── */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password"  element={<ResetPassword />} />

        <Route path="/maquinas"  element={<Maquinas />} />
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
        <Route path="/NotFound"    element={<NotFound />} />
        <Route path="*"            element={<NotFound />} />

      </Routes>
    </Router>
  );
}

export default App;