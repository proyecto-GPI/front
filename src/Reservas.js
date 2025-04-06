// Reservas.js
import React, { useState } from 'react';

function Reservas() {
  const [username, setUsername] = useState('');
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetch = () => {
    if (!username) return;
    setLoading(true);
    setError(null);

    // Asegúrate de actualizar la URL base si es necesario
    fetch(`http://127.0.0.1:8000/get_reservas_usuario/${username}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener las reservas');
        }
        return response.json();
      })
      .then(data => {
        console.log('Respuesta completa del servidor:', data); // Imprime la respuesta completa
        setReservas(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleFetch();
  };

  return (
    <div>
      <h2>Buscar Reservas por Usuario</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre de Usuario:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Ingresa tu nombre de usuario"
          />
        </label>
        <button type="submit">Buscar</button>
      </form>

      {loading && <p>Cargando reservas...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {reservas.length > 0 && (
        <ul>
          {reservas.map((reserva) => (
            <li key={reserva.id_reserva}>
              Reserva {reserva.id_reserva} - Fecha recogida: {reserva.fecha_recogida_propuesta}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Reservas;
