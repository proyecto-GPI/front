import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import './Admin.css';

// Datos de prueba si falla el fetch de oficinas
const fallbackOffices = [
  { id_oficina: 1, nombre: 'Oficina Madrid', direccion: 'Calle Falsa 123', ciudad: 'Madrid' },
  { id_oficina: 2, nombre: 'Oficina Barcelona', direccion: 'Av. Diagonal 456', ciudad: 'Barcelona' },
];

// Datos de prueba si falla el fetch de coches
const fallbackCoches = [
  { id: 1, marca: 'Toyota', modelo: 'Corolla', matricula: '1234ABC' },
  { id: 2, marca: 'Ford', modelo: 'Focus',   matricula: '5678DEF' },
];

export default function Admin() {
  // --- Estado oficinas ---
  const [addOpenOffice, setAddOpenOffice]         = useState(false);
  const [modifyOpenOffice, setModifyOpenOffice]   = useState(false);
  const [offices, setOffices]                     = useState([]);
  const [loadingOffices, setLoadingOffices]       = useState(false);
  const [formOffice, setFormOffice]               = useState({ id_oficina: '', nombre: '', direccion: '', ciudad: '' });
  const [selectedOriginalOffice, setSelectedOriginalOffice] = useState(null);

  // --- Estado coches ---
  const [modifyOpenCars, setModifyOpenCars]       = useState(false);
  const [coches, setCoches]                       = useState([]);
  const [loadingCoches, setLoadingCoches]         = useState(false);

  // --- Fetch oficinas ---
  const fetchOffices = async () => {
    setLoadingOffices(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/oficinas');
      if (!res.ok) throw new Error('Network error oficinas');
      const data = await res.json();
      setOffices(data);
    } catch {
      setOffices(fallbackOffices);
    } finally {
      setLoadingOffices(false);
    }
  };

  // --- Fetch coches ---
  const fetchCoches = async () => {
    setLoadingCoches(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/coches');
      if (!res.ok) throw new Error('Network error coches');
      const data = await res.json();
      setCoches(data);
    } catch {
      setCoches(fallbackCoches);
    } finally {
      setLoadingCoches(false);
    }
  };

  // --- Toggles ---
  const toggleAddOffice = useCallback(() => {
    setAddOpenOffice(o => !o);
    setFormOffice({ id_oficina: '', nombre: '', direccion: '', ciudad: '' });
    setSelectedOriginalOffice(null);
    setModifyOpenOffice(false);
  }, []);

  const toggleModifyOffice = useCallback(() => {
    const next = !modifyOpenOffice;
    setModifyOpenOffice(next);
    setAddOpenOffice(false);
    setSelectedOriginalOffice(null);
    if (next) fetchOffices();
  }, [modifyOpenOffice]);

  const toggleModifyCars = useCallback(() => {
    const next = !modifyOpenCars;
    setModifyOpenCars(next);
    // Si abrimos el panel de coches, lo cargamos
    if (next) fetchCoches();
  }, [modifyOpenCars]);

  // --- Formularios oficinas ---
  const handleOfficeChange = e => {
    const { name, value } = e.target;
    setFormOffice(f => ({ ...f, [name]: value }));
  };

  // --- Añadir oficina ---
  const handleAddOffice = async e => {
    e.preventDefault();
    try {
      const res = await fetch('http://127.0.0.1:8000/api/add_oficinas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formOffice),
      });
      if (!res.ok) {
        console.error('Error al añadir oficina:', (await res.json()).detail);
        return;
      }
      await fetchOffices();
      setAddOpenOffice(false);
    } catch (err) {
      console.error('Error red añadir oficina:', err);
    }
  };

  // --- Seleccionar oficina para modificar ---
  const selectOffice = office => {
    setSelectedOriginalOffice(office);
    setFormOffice({ ...office });
  };

  // --- Modificar oficina (delete + add) ---
  const handleModifyOffice = async e => {
    e.preventDefault();
    if (!selectedOriginalOffice) return;
    // Si no cambió nada, salimos
    const keys = ['id_oficina','nombre','direccion','ciudad'];
    const unchanged = keys.every(k => formOffice[k] === selectedOriginalOffice[k]);
    if (unchanged) {
      setSelectedOriginalOffice(null);
      return;
    }
    try {
      const delRes = await fetch(
        `http://127.0.0.1:8000/api/delete_oficinas/${selectedOriginalOffice.id_oficina}`,
        { method: 'DELETE' }
      );
      if (!delRes.ok) {
        console.error('Error al borrar oficina:', (await delRes.json()).detail);
        return;
      }
      const addRes = await fetch('http://127.0.0.1:8000/api/add_oficinas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formOffice),
      });
      if (!addRes.ok) {
        console.error('Error al añadir oficina modificada:', (await addRes.json()).detail);
        return;
      }
      await fetchOffices();
      setSelectedOriginalOffice(null);
      setModifyOpenOffice(false);
    } catch (err) {
      console.error('Error red modificar oficina:', err);
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
              <label>ID:
                <input name="id_oficina"   value={formOffice.id_oficina} onChange={handleOfficeChange} required />
              </label>
              <label>Nombre:
                <input name="nombre"       value={formOffice.nombre}     onChange={handleOfficeChange} required />
              </label>
              <label>Dirección:
                <input name="direccion"    value={formOffice.direccion}  onChange={handleOfficeChange} required />
              </label>
              <label>Ciudad:
                <input name="ciudad"       value={formOffice.ciudad}     onChange={handleOfficeChange} required />
              </label>
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
          {/* --- Modificar Oficina --- */}
          <button onClick={toggleModifyOffice}>Modificar oficina</button>
          {modifyOpenOffice && (
            <div className="office-list-inline open">
              {loadingOffices 
                ? <p>Cargando oficinas...</p>
                : !selectedOriginalOffice 
                  ? (
                    <ul>
                      {offices.map(o => (
                        <li key={o.id_oficina} onClick={() => selectOffice(o)}>
                          {o.nombre} ({o.ciudad})
                        </li>
                      ))}
                    </ul>
                  )
                  : (
                    <form className="office-form-inline open" onSubmit={handleModifyOffice}>
                      <label>ID:
                        <input name="id_oficina" value={formOffice.id_oficina} onChange={handleOfficeChange} required />
                      </label>
                      <label>Nombre:
                        <input name="nombre" value={formOffice.nombre} onChange={handleOfficeChange} required />
                      </label>
                      <label>Dirección:
                        <input name="direccion" value={formOffice.direccion} onChange={handleOfficeChange} required />
                      </label>
                      <label>Ciudad:
                        <input name="ciudad" value={formOffice.ciudad} onChange={handleOfficeChange} required />
                      </label>
                      <div className="form-actions">
                        <button type="submit" className="btn-save">Guardar</button>
                        <button type="button" className="btn-cancel" onClick={() => setSelectedOriginalOffice(null)}>Cancelar</button>
                      </div>
                    </form>
                  )
              }
            </div>
          )}

          {/* --- Modificar Coche --- */}
          <button onClick={toggleModifyCars}>Modificar coche</button>
          {modifyOpenCars && (
            <div className="office-list-inline open">
              {loadingCoches
                ? <p>Cargando coches...</p>
                : (
                  <ul>
                    {coches.map(c => (
                      <li key={c.id}>
                        {c.marca} {c.modelo} — {c.matricula}
                      </li>
                    ))}
                  </ul>
                )
              }
            </div>
          )}

          <button onClick={() => {/* lógica modificar tarifa */}}>Modificar tarifa</button>
        </div>
      </div>
    </div>
  );
}
