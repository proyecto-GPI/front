import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import './Admin.css';

// Datos de prueba si falla el fetch
const fallbackOffices = [
  { id_oficina: 1, nombre: 'Oficina Madrid', direccion: 'Calle Falsa 123', ciudad: 'Madrid' },
  { id_oficina: 2, nombre: 'Oficina Barcelona', direccion: 'Av. Diagonal 456', ciudad: 'Barcelona' },
];

export default function Admin() {
  const [addOpenOffice, setAddOpenOffice] = useState(false);
  const [modifyOpenOffice, setModifyOpenOffice] = useState(false);
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ id_oficina: '', nombre: '', direccion: '', ciudad: '' });
  const [selectedOriginal, setSelectedOriginal] = useState(null);

  // Fetch oficinas
  const fetchOffices = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/oficinas');
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      setOffices(data);
    } catch {
      setOffices(fallbackOffices);
    } finally {
      setLoading(false);
    }
  };

  const toggleAddOffice = useCallback(() => {
    setAddOpenOffice(o => !o);
    setFormData({ id_oficina: '', nombre: '', direccion: '', ciudad: '' });
    setSelectedOriginal(null);
    setModifyOpenOffice(false);
  }, []);

  const toggleModifyOffice = useCallback(() => {
    const next = !modifyOpenOffice;
    setModifyOpenOffice(next);
    setAddOpenOffice(false);
    setSelectedOriginal(null);
    if (next) fetchOffices();
  }, [modifyOpenOffice]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(fd => ({ ...fd, [name]: value }));
  };

  // Añadir Oficina
  const handleAddOffice = async e => {
    e.preventDefault();
    try {
      const res = await fetch('http://127.0.0.1:8000/api/add_oficinas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const err = await res.json();
        console.error('Error al añadir oficina:', err.detail || res.statusText);
        return;
      }
      await fetchOffices();
      setAddOpenOffice(false);
    } catch (err) {
      console.error('Error de red al añadir oficina:', err);
    }
  };

  // Seleccionar Oficina para modificar
  const selectOffice = office => {
    setSelectedOriginal(office);
    setFormData({ ...office });
  };

  // Guardar modificación: delete + add
  const handleModifyOffice = async e => {
    e.preventDefault();
    if (!selectedOriginal) return;
    const unchanged = ['id_oficina','nombre','direccion','ciudad'].every(
      key => formData[key] === selectedOriginal[key]
    );
    if (unchanged) {
      setSelectedOriginal(null);
      return;
    }
    try {
      const delRes = await fetch(`http://127.0.0.1:8000/api/delete_oficinas/${selectedOriginal.id_oficina}`, { method: 'DELETE' });
      if (!delRes.ok) {
        const err = await delRes.json();
        console.error('Error al borrar oficina:', err.detail || delRes.statusText);
        return;
      }
      const addRes = await fetch('http://127.0.0.1:8000/api/add_oficinas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!addRes.ok) {
        const err = await addRes.json();
        console.error('Error al añadir oficina modificada:', err.detail || addRes.statusText);
        return;
      }
      await fetchOffices();
      setSelectedOriginal(null);
      setModifyOpenOffice(false);
    } catch (err) {
      console.error('Error de red al modificar oficina:', err);
    }
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
        {/* IZQUIERDA: Añadir */}
        <div className="left-column">
          <button onClick={toggleAddOffice}>Añadir oficina</button>
          {addOpenOffice && (
            <form className="office-form-inline open" onSubmit={handleAddOffice}>
              <label>ID:<input name="id_oficina" value={formData.id_oficina} onChange={handleChange} required /></label>
              <label>Nombre:<input name="nombre" value={formData.nombre} onChange={handleChange} required /></label>
              <label>Dirección:<input name="direccion" value={formData.direccion} onChange={handleChange} required /></label>
              <label>Ciudad:<input name="ciudad" value={formData.ciudad} onChange={handleChange} required /></label>
              <div className="form-actions">
                <button type="submit" className="btn-save">Guardar</button>
                <button type="button" className="btn-cancel" onClick={toggleAddOffice}>Cancelar</button>
              </div>
            </form>
          )}
          <button onClick={() => {/* lógica añadir coche */}}>Añadir coche</button>
          <button onClick={() => {/* lógica añadir tarifas */}}>Añadir tarifas</button>
        </div>

        {/* DERECHA: Modificar */}
        <div className="right-column">
          <button onClick={toggleModifyOffice}>Modificar oficina</button>
          {modifyOpenOffice && (
            <div className="office-list-inline open">
              {loading ? <p>Cargando...</p> : (
                !selectedOriginal ? (
                  <ul>
                    {offices.map(o => (
                      <li key={o.id_oficina} onClick={() => selectOffice(o)}>{o.nombre}</li>
                    ))}
                  </ul>
                ) : (
                  <form className="office-form-inline open" onSubmit={handleModifyOffice}>
                    <label>ID:<input name="id_oficina" value={formData.id_oficina} onChange={handleChange} required /></label>
                    <label>Nombre:<input name="nombre" value={formData.nombre} onChange={handleChange} required /></label>
                    <label>Dirección:<input name="direccion" value={formData.direccion} onChange={handleChange} required /></label>
                    <label>Ciudad:<input name="ciudad" value={formData.ciudad} onChange={handleChange} required /></label>
                    <div className="form-actions">
                      <button type="submit" className="btn-save">Guardar</button>
                      <button type="button" className="btn-cancel" onClick={() => setSelectedOriginal(null)}>Cancelar</button>
                    </div>
                  </form>
                )
              )}
            </div>
          )}
          <button onClick={() => {/* lógica modificar coche */}}>Modificar coche</button>
          <button onClick={() => {/* lógica modificar tarifa */}}>Modificar tarifa</button>
        </div>
      </div>
    </div>
  );
}
