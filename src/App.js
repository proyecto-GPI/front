import React, { useState } from 'react';
import { FaUser, FaMapMarkerAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import mapa from './mapa.jpg';
import './App.css';

function App() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [activeMarker, setActiveMarker] = useState(null);
  const navigate = useNavigate();  // Hook de navegación

  // Parámetros para ajustar las localizaciones de las oficinas (markers)
  const markers = [
    { id: 1, name: "Oficina Central", location: "Calle Mayor, 1, Madrid", top: '30%', left: '40%' },
    { id: 2, name: "Sucursal Norte", location: "Avenida del Norte, 123, Barcelona", top: '50%', left: '50%' }
  ];

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const openLogin = () => {
    navigate("/login");   // Redirige a la ruta de Login
    setDropdownVisible(false);
  };

  const openRegister = () => {
    navigate("/register");  // Redirige a la ruta de Registro
    setDropdownVisible(false);
  };

  const handleMarkerClick = (marker) => {
    setActiveMarker(activeMarker === marker.id ? null : marker.id);
  };

  const openRenting = () => {
    navigate("/renting");  // Redirige a la ruta de Renting
    setDropdownVisible(false);
  };

  return (
    <div className="App">
      <header className="header">
        <div className="right-header">
          {/* Enlaces de navegación a la derecha */}
          <nav className="nav-links">
            <a href="/renting">Renting</a>
            <a href="/quienes-somos">Quiénes somos</a>
            <a href="/ofertas">Ofertas</a>
          </nav>
          {/* Icono de usuario */}
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
            <input type="text" placeholder="Ubicación" />
            <input type="text" placeholder="Destino" />
          </div>
          <div className="rental-dates">
            <div className="date-time">
              <input type="date" placeholder="Fecha de inicio" />
              <input type="time" placeholder="Hora de inicio" />
            </div>
            <div className="date-time">
              <input type="date" placeholder="Fecha de devolución" />
              <input type="time" placeholder="Hora de devolución" />
            </div>
          </div>
          <button className="search-button" onClick={openRenting}>Buscar</button>
        </div>
      </main>
    </div>
  );
}

export default App;

