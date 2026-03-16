import { useEffect, useMemo, useState } from "react";

function toCurrency(value) {
  return Number(value || 0).toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 2,
  });
}

function getInitialItems(storageKey, fallbackItems) {
  try {
    const stored = localStorage.getItem(storageKey);

    if (!stored) {
      return fallbackItems;
    }

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      return fallbackItems;
    }

    return parsed;
  } catch {
    return fallbackItems;
  }
}

function getNextId(items) {
  const maxId = items.reduce((max, item) => (item.id > max ? item.id : max), 0);
  return maxId + 1;
}

export default function AdminCrudPanel({
  title,
  storageKey,
  seedItems,
  quantityLabel = "Cantidad",
  emptyMessage,
}) {
  const [items, setItems] = useState(() => getInitialItems(storageKey, seedItems));
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, storageKey]);

  const totalInventory = useMemo(
    () => items.reduce((acc, item) => acc + Number(item.quantity || 0), 0),
    [items]
  );

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setQuantity("");
    setEditingId(null);
  };

  const validate = () => {
    if (!name.trim() || !description.trim()) {
      return "Nombre y descripcion son obligatorios.";
    }

    if (Number(price) <= 0) {
      return "El precio debe ser mayor a 0.";
    }

    if (!Number.isFinite(Number(quantity)) || Number(quantity) < 0) {
      return "La cantidad debe ser 0 o mayor.";
    }

    return "";
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationError = validate();

    if (validationError) {
      setError(validationError);
      setStatus("");
      return;
    }

    const payload = {
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      quantity: Number(quantity),
    };

    if (editingId !== null) {
      setItems((currentItems) =>
        currentItems.map((item) => (item.id === editingId ? { ...item, ...payload } : item))
      );
      setStatus("Registro actualizado correctamente.");
    } else {
      setItems((currentItems) => [...currentItems, { id: getNextId(currentItems), ...payload }]);
      setStatus("Registro agregado correctamente.");
    }

    setError("");
    resetForm();
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setName(item.name);
    setDescription(item.description);
    setPrice(String(item.price));
    setQuantity(String(item.quantity));
    setError("");
    setStatus("");
  };

  const handleDelete = (id) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
    setError("");
    setStatus("Registro eliminado.");

    if (editingId === id) {
      resetForm();
    }
  };

  return (
    <section className="admin-panel-card admin-fade-in-up">
      <div className="admin-panel-header">
        <h2>{title}</h2>
        <div className="admin-panel-meta">
          <span>{items.length} registros</span>
          <span>{quantityLabel}: {totalInventory}</span>
        </div>
      </div>

      <form className="admin-form admin-form-extended" onSubmit={handleSubmit}>
        <label htmlFor={`${storageKey}-name`}>Nombre</label>
        <input
          id={`${storageKey}-name`}
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <label htmlFor={`${storageKey}-description`}>Descripcion</label>
        <textarea
          id={`${storageKey}-description`}
          rows="3"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        ></textarea>

        <label htmlFor={`${storageKey}-price`}>Precio</label>
        <input
          id={`${storageKey}-price`}
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
        />

        <label htmlFor={`${storageKey}-quantity`}>{quantityLabel}</label>
        <input
          id={`${storageKey}-quantity`}
          type="number"
          min="0"
          step="1"
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
        />

        <div className="admin-form-actions">
          <button type="submit" className="admin-btn admin-btn-primary">
            {editingId !== null ? "Actualizar" : "Agregar"}
          </button>

          {editingId !== null && (
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={resetForm}
            >
              Cancelar edicion
            </button>
          )}
        </div>

        {error && (
          <p className="admin-feedback admin-feedback-error" role="alert">
            {error}
          </p>
        )}

        {!error && status && (
          <p className="admin-feedback admin-feedback-ok" role="status" aria-live="polite">
            {status}
          </p>
        )}
      </form>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripcion</th>
              <th>Precio</th>
              <th>{quantityLabel}</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan="5" className="admin-empty-row">
                  {emptyMessage}
                </td>
              </tr>
            )}

            {items.map((item) => (
              <tr key={item.id} className="admin-row-animated">
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>{toCurrency(item.price)}</td>
                <td>{item.quantity}</td>
                <td>
                  <div className="admin-row-actions">
                    <button
                      type="button"
                      className="admin-btn admin-btn-secondary"
                      onClick={() => handleEdit(item)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn-danger"
                      onClick={() => handleDelete(item.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
