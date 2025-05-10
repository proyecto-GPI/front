import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import './Admin.css';

// Datos de prueba si falla el fetch
const fallbackOffices = [
  { id: 1, name: 'Oficina Madrid' },
  { id: 2, name: 'Oficina Barcelona' },
  { id: 3, name: 'Oficina Rota' },
  { id: 4, name: 'Oficina Galicia' },
];

export default function Admin() {
  const [addOpen, setAddOpen] = useState(false);
  const [modifyOpen, setModifyOpen] = useState(false);
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ id: '', calle: '', ciudad: '' });

  const toggleAdd = useCallback(() => {
    setAddOpen(o => !o);
    setFormData({ id: '', calle: '', ciudad: '' });
  }, []);

  const toggleModify = useCallback(async () => {
    const next = !modifyOpen;
    setModifyOpen(next);
    if (next) {
      setLoading(true);
      try {
        const res = await fetch('http://127.0.0.1:8000/api/oficinas');
        if (!res.ok) throw new Error('Network error');
        const data = await res.json();
        setOffices(data.map(o => ({ id: o.id, name: o.name || `${o.calle}, ${o.ciudad}` })));
      } catch {
        setOffices(fallbackOffices);
      } finally {
        setLoading(false);
      }
    }
  }, [modifyOpen]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(fd => ({ ...fd, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log('Enviar nueva oficina:', formData);
    // Aquí iría la lógica para hacer POST a la API…
    setAddOpen(false);
  };

  return (
    <div className="admin-container">
      <header className="admin-header" role="banner">
        <h1>Página de administrador</h1>
        <Link to="/" className="admin-home" aria-label="Inicio">
          <FaHome size={40} title="Home" />
        </Link>
      </header>

      <div className="actions-title"> Acciones disponibles</div>

      <div className="actions-grid">
        <div className="left-column">
          <button onClick={toggleAdd}>Añadir oficina</button>
          {addOpen && (
            <form className={`office-form-inline ${addOpen ? 'open' : ''}`} onSubmit={handleSubmit}>
              <label>ID:<input name="id" value={formData.id} onChange={handleChange} required /></label>
              <label>Calle:<input name="calle" value={formData.calle} onChange={handleChange} required /></label>
              <label>Ciudad:<input name="ciudad" value={formData.ciudad} onChange={handleChange} required /></label>
              <div className="form-actions">
                <button type="submit" className="btn-save">Guardar</button>
                <button type="button" className="btn-cancel" onClick={toggleAdd}>Cancelar</button>
              </div>
            </form>
          )}
          <button onClick={() => {}}>Añadir coche</button>
          <button onClick={() => {}}>Añadir tarifas</button>
        </div>
        <div className="right-column">
          <button onClick={toggleModify}>Modificar oficina</button>
          {modifyOpen && (
            <div className={`office-list-inline ${modifyOpen ? 'open' : ''}`}>
              {loading ? <p>Cargando...</p> : (
                <ul>
                  {offices.map(o => <li key={o.id}>{o.name}</li>)}
                </ul>
              )}
            </div>
          )}
          <button>Modificar coche</button>
          <button>Modificar tarifa</button>
        </div>
      </div>
    </div>
  );
}
