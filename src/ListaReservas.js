// ListaReservas.js
import React, { useState, useContext, useEffect } from 'react';
import './ListaReservas.css'; // Importa el archivo CSS
import { AppContext } from './AppContext';

// --- Funciones de formato (sin cambios) ---
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return dateString;
  }
};

const formatCurrency = (amount) => {
    // Asegurarse de que amount es un número
    const numericAmount = typeof amount === 'number' ? amount : parseFloat(amount);
    if (isNaN(numericAmount)) {
        console.warn("Invalid amount for currency formatting:", amount);
        return 'N/A'; // O algún valor por defecto
    }
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(numericAmount);
};


const maskCardNumber = (cardNumber) => {
  if (!cardNumber || cardNumber.length < 4) return '****';
  // Asegurarse que es string antes de slice
  const cardStr = String(cardNumber);
  return `**** **** **** ${cardStr.slice(-4)}`;
};

const getStatus = (reserva) => {
    if (reserva.fecha_devolucion_real) {
        return { text: 'Completada', className: 'status-completada' };
    } else if (reserva.fecha_recogida_real) {
        return { text: 'En Curso', className: 'status-en-curso' };
    } else if (reserva.fecha_confirmacion) {
        return { text: 'Confirmada', className: 'status-confirmada' };
    }
    return { text: 'Pendiente', className: 'status-pendiente' };
};
// --- Fin Funciones de formato ---

// El componente ya no recibe 'reservas' como prop
function ListaReservas() {
  // 1. Obtener cid del contexto
  const { cid } = useContext(AppContext); // Solo necesitamos cid aquí

  // 2. Estados locales para las reservas, carga y errores
  const [reservasList, setReservasList] = useState([]); // Estado para guardar las reservas
  const [loading, setLoading] = useState(true); // Estado para indicar carga
  const [error, setError] = useState(null); // Estado para guardar errores

  // 3. useEffect para hacer fetch cuando cambie cid
  useEffect(() => {
    // Solo hacemos fetch si tenemos un cid (usuario logueado)
    if (cid) {
      setLoading(true); // Indicar que estamos cargando
      setError(null); // Limpiar errores previos
      setReservasList([]); // Limpiar reservas previas mientras carga

      fetch(`http://127.0.0.1:8000/get_reservas_usuario/${cid}`) // Usar cid en la URL
        .then(response => {
          if (!response.ok) {
            // Intentar leer el cuerpo del error si existe
             return response.text().then(text => {
                 console.error("Error response body:", text);
                 throw new Error(`Error ${response.status}: ${text || 'Error al obtener las reservas'}`);
             });
          }
          return response.json(); // Convertir respuesta a JSON
        })
        .then(data => {
          console.log('Reservas obtenidas:', data); // Log para depuración
          // Asegurarse que 'data' es un array antes de asignarlo
          if (Array.isArray(data)) {
              setReservasList(data); // Guardar las reservas en el estado
          } else {
              console.warn("La respuesta de la API no es un array:", data);
              setReservasList([]); // Asignar array vacío si la respuesta no es válida
              // Podrías establecer un error aquí también si lo prefieres
              // setError("Formato de respuesta inesperado de la API.");
          }
          setLoading(false); // Indicar que la carga ha terminado
        })
        .catch(err => {
          console.error('Error en fetch:', err); // Log del error
          setError(err.message); // Guardar el mensaje de error
          setLoading(false); // Indicar que la carga ha terminado (con error)
        });
    } else {
      // Si no hay cid, no estamos logueados
      setLoading(false); // No estamos cargando
      setReservasList([]); // Vaciar la lista
      setError(null); // No hay error, simplemente no hay usuario
      // O podrías poner un mensaje específico: setError("Inicia sesión para ver tus reservas");
    }
  }, [cid]); // El efecto se ejecuta cada vez que 'cid' cambie

  // 4. Renderizado condicional basado en los estados
  if (loading) {
    return (
      <div className="lista-reservas-container loading-message">
        <h2>Mis Reservas</h2>
        <p>Cargando tus reservas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lista-reservas-container error-message">
        <h2>Mis Reservas</h2>
        <p>Error al cargar las reservas: {error}</p>
      </div>
    );
  }

   if (!cid) {
    return (
      <div className="lista-reservas-container no-reservas">
        <h2>Mis Reservas</h2>
        <p>Por favor, inicia sesión para ver tus reservas.</p>
      </div>
    );
  }


  if (reservasList.length === 0) {
    return (
      <div className="lista-reservas-container no-reservas">
        <h2>Mis Reservas</h2>
        <p>No tienes reservas activas o pasadas.</p>
      </div>
    );
  }

  // 5. Renderizado de la lista usando 'reservasList' del estado local
  return (
    <div className="lista-reservas-container">
      <h2>Mis Reservas</h2>
      <ul className="reservas-list">
        {reservasList.map((reserva) => { // Usar reservasList del estado
          // Validar que 'reserva' es un objeto antes de intentar acceder a sus propiedades
           if (typeof reserva !== 'object' || reserva === null) {
                console.warn("Elemento inválido en reservasList:", reserva);
                return null; // O mostrar algún marcador de posición de error
            }
           const status = getStatus(reserva);
           return (
            <li key={reserva.id_reserva} className="reserva-item">
              <div className="reserva-header">
                {/* Asegurar que id_reserva existe */}
                <h3>Reserva #1</h3>
                <span className={`status-badge ${status.className}`}>{status.text}</span>
              </div>
              <div className="reserva-details">
                 {/* Añadir comprobaciones opcionales (?) por si alguna propiedad no viene */}
                <p><strong>Recogida:</strong> {reserva.direccion_oficina_recogida_propuesta ?? 'N/A'} - <span>{formatDate(reserva.fecha_recogida_propuesta)}</span></p>
                <p><strong>Devolución:</strong> {reserva.direccion_oficina_devolucion_propuesta ?? 'N/A'} - <span>{formatDate(reserva.fecha_devolucion_propuesta)}</span></p>
                <p><strong>Importe Previsto:</strong> {formatCurrency(reserva.importe_final_previsto)}</p>
                <p><strong>Confirmada el:</strong> {formatDate(reserva.fecha_confirmacion)}</p>
                <p><strong>Tarjeta:</strong> {maskCardNumber(reserva.num_tarjeta)}</p>
                {reserva.fecha_recogida_real && (
                   <p><strong>Recogida Real:</strong> {reserva.direccion_oficina_recogida_real || 'N/A'} - <span>{formatDate(reserva.fecha_recogida_real)}</span></p>
                 )}
                 {reserva.fecha_devolucion_real && (
                   <p><strong>Devolución Real:</strong> {reserva.direccion_oficina_devolucion_real || 'N/A'} - <span>{formatDate(reserva.fecha_devolucion_real)}</span></p>
                 )}
              </div>
            </li>
           );
        })}
      </ul>
    </div>
  );
}

export default ListaReservas;