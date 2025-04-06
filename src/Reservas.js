// Reservas.js
import React, { useState } from 'react';

function Reservas() {
  // Estados para la búsqueda de reservas
  const [username, setUsername] = useState('');
  const [reservas, setReservas] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  // Estados para la creación de una nueva reserva
  const [newReserva, setNewReserva] = useState({
    id_user: '',
    id_oficina: '',
    id_coche: '',
    fecha_recogida: '',
    fecha_devolucion: '',
    num_tarjeta: ''
  });
  const [postLoading, setPostLoading] = useState(false);
  const [postError, setPostError] = useState(null);
  const [postResponse, setPostResponse] = useState(null);

  // Función para obtener reservas (GET)
  const handleFetchSubmit = (e) => {
    e.preventDefault();
    if (!username) return;
    setFetchLoading(true);
    setFetchError(null);

    fetch(`http://127.0.0.1:8000/get_reservas_usuario/${username}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener las reservas');
        }
        return response.json();
      })
      .then(data => {
        console.log('Respuesta completa del GET:', data); // Imprime la respuesta del GET
        setReservas(data);
        setFetchLoading(false);
      })
      .catch(err => {
        setFetchError(err.message);
        setFetchLoading(false);
      });
  };

  // Función para manejar cambios en el formulario de nueva reserva
  const handleNewReservaChange = (e) => {
    setNewReserva({
      ...newReserva,
      [e.target.name]: e.target.value
    });
  };

  // Función para enviar la nueva reserva (POST)
  const handleReservaSubmit = (e) => {
    e.preventDefault();
    setPostLoading(true);
    setPostError(null);

    fetch('http://127.0.0.1:8000/api/reserve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newReserva)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al realizar la reserva');
        }
        return response.json();
      })
      .then(data => {
        console.log('Respuesta completa del POST:', data); // Imprime la respuesta del POST
        setPostResponse(data);
        setPostLoading(false);
      })
      .catch(err => {
        setPostError(err.message);
        setPostLoading(false);
      });
  };

  return (
    <div>
      <h2>Buscar Reservas por Usuario</h2>
      <form onSubmit={handleFetchSubmit}>
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

      {fetchLoading && <p>Cargando reservas...</p>}
      {fetchError && <p style={{ color: 'red' }}>Error: {fetchError}</p>}
      {reservas.length > 0 && (
        <ul>
          {reservas.map((reserva) => (
            <li key={reserva.id_reserva}>
              Reserva {reserva.id_reserva} - Fecha recogida: {reserva.fecha_recogida_propuesta}
            </li>
          ))}
        </ul>
      )}

      <h2>Crear Nueva Reserva</h2>
      <form onSubmit={handleReservaSubmit}>
        <label>
          ID Usuario:
          <input
            type="text"
            name="id_user"
            value={newReserva.id_user}
            onChange={handleNewReservaChange}
            placeholder="ID Usuario"
          />
        </label>
        <br />
        <label>
          ID Oficina:
          <input
            type="number"
            name="id_oficina"
            value={newReserva.id_oficina}
            onChange={handleNewReservaChange}
            placeholder="ID Oficina"
          />
        </label>
        <br />
        <label>
          ID Coche:
          <input
            type="number"
            name="id_coche"
            value={newReserva.id_coche}
            onChange={handleNewReservaChange}
            placeholder="ID Coche"
          />
        </label>
        <br />
        <label>
          Fecha Recogida:
          <input
            type="date"
            name="fecha_recogida"
            value={newReserva.fecha_recogida}
            onChange={handleNewReservaChange}
          />
        </label>
        <br />
        <label>
          Fecha Devolución:
          <input
            type="date"
            name="fecha_devolucion"
            value={newReserva.fecha_devolucion}
            onChange={handleNewReservaChange}
          />
        </label>
        <br />
        <label>
          Número de Tarjeta:
          <input
            type="text"
            name="num_tarjeta"
            value={newReserva.num_tarjeta}
            onChange={handleNewReservaChange}
            placeholder="Número de Tarjeta"
          />
        </label>
        <br />
        <button type="submit">Realizar Reserva</button>
      </form>

      {postLoading && <p>Realizando reserva...</p>}
      {postError && <p style={{ color: 'red' }}>Error: {postError}</p>}
      {postResponse && (
        <div>
          <h3>Reserva Realizada</h3>
          <pre>{JSON.stringify(postResponse, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default Reservas;
