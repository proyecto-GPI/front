import React, { useState, useEffect } from 'react';
import { FaUser, FaMapMarkerAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import mapa from './mapa.jpg';
import './App.css';

function App() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [activeMarker, setActiveMarker] = useState(null);
  const [offices, setOffices] = useState([]);
  const navigate = useNavigate();

  // Parámetros para ajustar las localizaciones de las oficinas (markers)
  const markers = [
    { id: 1, name: "Oficina Central", location: "Calle Mayor, 1, Madrid", top: '35%', left: '37%' },
    { id: 2, name: "Sucursal Norte", location: "Avenida del Norte, 123, Barcelona", top: '23%', left: '78%' }
  ];

  useEffect(() => {
    // Llamada a la API para obtener las oficinas
    fetch("/api/oficinas")
      .then(response => response.json())
      .then(data => setOffices(data))
      .catch(error => console.error("Error al obtener las oficinas:", error));
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const openLogin = () => {
    navigate("/login");
    setDropdownVisible(false);
  };

  const openRegister = () => {
    navigate("/register");
    setDropdownVisible(false);
  };

  const handleMarkerClick = (marker) => {
    setActiveMarker(activeMarker === marker.id ? null : marker.id);
  };

  const openRenting = () => {
    navigate("/renting");
    setDropdownVisible(false);
  };

  // Función para manejar redirigir a la página de renting con los datos de disponibilidad
  const handleSearchClick = async () => {
    // Capturar valores seleccionados/introducidos por el usuario
    const idOficinaOrigen = document.querySelector("select[name='origen']").value;
    const idOficinaDestino = document.querySelector("select[name='destino']").value;
    const fechaInicio = document.querySelector("input[name='fecha_inicio']").value;
    const horaInicio = document.querySelector("input[name='hora_inicio']").value;
    const fechaFin = document.querySelector("input[name='fecha_fin']").value;
    const horaFin = document.querySelector("input[name='hora_fin']").value;
  
    // Validación de los campos
    const requiredFields = [];
    if (!idOficinaOrigen) requiredFields.push("Origen");
    if (!idOficinaDestino) requiredFields.push("Destino");
    if (!fechaInicio || !horaInicio) requiredFields.push("Fecha y hora de inicio");
    if (!fechaFin || !horaFin) requiredFields.push("Fecha y hora de devolución");
  
    if (requiredFields.length > 0) {
      alert(`Por favor, completa los siguientes campos:\n${requiredFields.join("\n")}`);
      return;
    }
  
    // Construir fechas completas en el formato requerido
    const fechaInicioCompleta = `${fechaInicio} ${horaInicio}:00`; // Ejemplo: "07/04/2025 15:00:00"
    const fechaFinCompleta = `${fechaFin} ${horaFin}:00`;
  
    try {
      // Llamada a la API para obtener disponibilidad
      const response = await fetch(`/api/availability?id_oficina=${idOficinaOrigen}&fecha_inicio=${fechaInicioCompleta}`);
      if (!response.ok) {
        throw new Error("Error al obtener disponibilidad de coches");
      }
      const availableCars = await response.json();
  
      // Redirigir a "/renting" con coches disponibles y guardar datos de la vuelta
      navigate('/renting', { 
        state: { 
          cars: availableCars, 
          returnDetails: { idOficinaDestino, fechaFinCompleta } 
        } 
      });
    } catch (error) {
      console.error("Error al obtener los coches disponibles:", error);
    }
  };
  
  

  return (
    <div className="App">
      <header className="header">
        <div className="right-header">
          <nav className="nav-links">
            {/*<a href="/renting">Renting</a>*/}
            <a href="/quienes-somos">Quiénes somos</a>
            <a href="/ofertas">Ofertas</a>
          </nav>
          <div className="profile-container" onClick={toggleDropdown}>
            <FaUser size={40} className="profile-icon" />
            {dropdownVisible && (
              <div className="dropdown">
                <ul>
                  <li onClick={openLogin}>Iniciar Sesión</li>
                  <li onClick={openRegister}>Registrarse</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="main-content">
        <h1>Auto Veloz</h1>
        <div className="map-container">
          <img src={mapa} alt="Mapa de España" />
          {markers.map(marker => (
            <div
              key={marker.id}
              style={{
                position: 'absolute',
                top: marker.top,
                left: marker.left,
                cursor: 'pointer'
              }}
              onClick={() => handleMarkerClick(marker)}
            >
              <FaMapMarkerAlt size={30} color="red" />
              {activeMarker === marker.id && (
                <div className="marker-popup">
                  <p>{marker.name}</p>
                  <p>{marker.location}</p>
                </div>
            )}
            </div>
          ))}
        </div>
        <div className="rental-section">
          <div className="rental-filters">
            <select name="origen">
              <option value="">Selecciona origen</option>
              {offices.map((office) => (
                 <option key={office.id_oficina} value={office.id_oficina}>
                  {office.direccion}
                 </option>
            ))}
            </select>
            <select name="destino">
             <option value="">Selecciona destino</option>
                {offices.map((office) => (
                  <option key={office.id_oficina} value={office.id_oficina}>
                  {office.direccion}
              </option>
             ))}
            </select>
          </div>
          <div className="rental-dates">
            <div className="date-time">
              <input type="date" name="fecha_inicio" placeholder="Fecha de inicio" />
              <input type="time" name="hora_inicio" placeholder="Hora de inicio" />
            </div>
            <div className="date-time">
              <input type="date" name="fecha_fin" placeholder="Fecha de devolución" />
              <input type="time" name="hora_fin" placeholder="Hora de devolución" />
            </div>
          </div>
          <button className="search-button" onClick={handleSearchClick}>Buscar</button>
        </div>
      </main>
    </div>
  );
}

export default App;
