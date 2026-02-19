import React from "react";

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="error-message"
    >
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;
