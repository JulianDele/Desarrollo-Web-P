import { Outlet } from "react-router-dom";
import { useState } from "react";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import "../styles/admin.css";

export default function AdminLayout() {
  const [titulo, setTitulo] = useState("Bienvenido al Panel Principal");

  return (
    <div className="admin-container">
      <AdminSidebar setTitulo={setTitulo} />

      <div className="admin-main">
        <AdminNavbar />
        <div className="admin-content">
          <Outlet context={{ titulo }} />
        </div>
      </div>
    </div>
  );
}
