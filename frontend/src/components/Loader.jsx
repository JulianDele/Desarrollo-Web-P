import React from "react";
import "../styles/main.css";

const Loader = ({ text = "Cargando información..." }) => {
  return (
    <div
      className="loader-container"
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="spinner" aria-hidden="true"></div>
      <p className="loader-text">{text}</p>
    </div>
  );
};

export default Loader;
