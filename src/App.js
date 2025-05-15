import React, { useState, useContext, useEffect } from 'react';
import { FaUser, FaMapMarkerAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import mapa from './mapa.jpg';
import './App.css';
import { AppContext } from './AppContext';

export default function App() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [activeMarker, setActiveMarker] = useState(null);
  const [activeInput, setActiveInput] = useState(null);
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');
  const [idOrigen, setIdOrigen] = useState(null);
  const [idDestino, setIdDestino] = useState(null);
  const [offices, setOffices] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaDevolucion, setFechaDevolucion] = useState('');
  const navigate = useNavigate();

  const {
    cid,
    cSetid,
    cofinicio,
    csetofinicio,
    cofinal,
    csetofinal,
    csetfecharec,
    csetfechadev,
    tipoUsuario
  } = useContext(AppContext);

// Mapa de coordenadas para cada provincia/ciudad
const coordMap = {
  // Andalucía
  "Almería":        { top: '73%',   left: '46%' },
  "Cádiz":          { top: '76%',   left: '18%' },
  "Córdoba":        { top: '63%',   left: '29%' },
  "Granada":        { top: '70%',   left: '38%' },
  "Huelva":         { top: '68.5%', left: '13.5%' },
  "Jaén":           { top: '62%',   left: '37%' },
  "Málaga":         { top: '74%',   left: '32%' },
  "Sevilla":        { top: '67%',   left: '21%' },

  // Aragón
  "Huesca":         { top: '15%',   left: '61%' },
  "Teruel":         { top: '36%',   left: '56%' },
  "Zaragoza":       { top: '21.5%', left: '56%' },

  // Asturias
  "Asturias":       { top: '2.5%',  left: '23%' },

  // Cantabria
  "Cantabria":      { top: '2%',    left: '35%' },

  // Castilla y León
  "Ávila":          { top: '33%',   left: '29%' },
  "Burgos":         { top: '16%',   left: '38%' },
  "León":           { top: '10%',   left: '24%' },
  "Palencia":       { top: '16%',   left: '30.5%' },
  "Salamanca":      { top: '29%',   left: '23%' },
  "Segovia":        { top: '28.5%', left: '34%' },
  "Soria":          { top: '21%',   left: '45%' },
  "Valladolid":     { top: '21%',   left: '30%' },
  "Zamora":         { top: '22%',   left: '23%' },

  // Castilla-La Mancha
  "Albacete":       { top: '51%',   left: '50%' },
  "Ciudad Real":    { top: '52%',   left: '35%' },
  "Cuenca":         { top: '40%',   left: '50%' },
  "Guadalajara":    { top: '31%',   left: '40%' },
  "Toledo":         { top: '41%',   left: '35%' },

  // Cataluña
  "Barcelona":      { top: '22%',   left: '79%' },
  "Gerona":         { top: '17%',   left: '83%' },
  "Lérida":         { top: '21%',   left: '68%' },
  "Tarragona":      { top: '27%',   left: '70%' },

  // Extremadura
  "Badajoz":        { top: '56%',   left: '18%' },
  "Cáceres":        { top: '42%',   left: '23%' },

  // Galicia
  "La Coruña":      { top: '3%',    left: '7%' },
  "Lugo":           { top: '4%',    left: '12%' },
  "Orense":         { top: '15%',   left: '13%' },
  "Pontevedra":     { top: '12%',   left: '15%' },

  // Islas Baleares
  "Menorca":        { top: '52%',   left: '92%' },
  "Mallorca":       { top: '56%',   left: '82%' },
  "Ibiza":          { top: '64.5%', left: '70%' },
  "Formetera":      { top: '68.5%', left: '71%' },

  // La Rioja
  "La Rioja":       { top: '13%',   left: '45%' },

  // Madrid
  "Madrid":         { top: '35%',   left: '37%' },

  // Murcia
  "Murcia":         { top: '62%',   left: '55%' },

  // Navarra
  "Navarra":        { top: '10%',   left: '51%' },

  // País Vasco
  "Álava":          { top: '8%',    left: '45%' },
  "Guipúzcoa":      { top: '5%',    left: '48%' },
  "Vizcaya":        { top: '4%',    left: '43%' },

  // Valencia
  "Alicante":       { top: '58%',   left: '58.5%' },
  "Castellón":      { top: '35%',   left: '64%' },
  "Valencia":       { top: '48%',   left: '60%' },
};


  // Fetch de oficinas y asignación de coordenadas
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/oficinas")
      .then(res => {
        if (!res.ok) throw new Error("Fetch fallido");
        return res.json();
      })
      .then(data => {
        // Data viene como [{ id_oficina, nombre, direccion, ciudad }, ...]
        const withCoords = data.map(of => {
          const coords = coordMap[of.ciudad] || { top: '50%', left: '50%' };
          return {
            id: of.id_oficina,
            name: of.nombre,
            location: of.direccion,
            top: coords.top,
            left: coords.left
          };
        });
        setOffices(withCoords);
      })
      .catch(err => {
        console.error("Error fetching offices:", err);
        // Oficina de fallback
        setOffices([{
          id: 999,
          name: "Oficina por defecto",
          location: "Desconocida",
          top: '50%',
          left: '50%'
        }]);
      });
  }, []);

  const toggleDropdown = () => setDropdownVisible(v => !v);
  const openLogin    = () => { navigate("/login");    setDropdownVisible(false); };
  const openRegister = () => { navigate("/register"); setDropdownVisible(false); };
  const openAdmin    = () => { navigate("/admin");    setDropdownVisible(false); };

  const handleMarkerClick = id =>
    setActiveMarker(activeMarker === id ? null : id);

  const openRenting = () => {
    if (!cid) {
      navigate("/login");
      return;
    }
    if (idOrigen && idDestino) {
      csetofinicio(idOrigen);
      csetofinal(idDestino);
      navigate("/renting");
    } else {
      alert("Por favor, selecciona Origen y Destino");
    }
    setDropdownVisible(false);
  };

  const handleOfficeSelect = office => {
    if (activeInput === 'origen') {
      csetofinicio(office);
      setOrigen(office.location);
      setIdOrigen(office.id);
    } else {
      csetofinal(office);
      setDestino(office.location);
      setIdDestino(office.id);
    }
    setActiveInput(null);
  };

  return (
    <div className="App">
      <header className="header">
        <div className="right-header">
          <nav className="nav-links">
            <a href="/renting">Renting</a>
            <a href="/quienes-somos">Quiénes somos</a>
            <a href="/ofertas">Ofertas</a>
          </nav>
          <div className="profile-container" onClick={toggleDropdown}>
            <FaUser size={40} className="profile-icon" />
            {dropdownVisible && (
              <div className="dropdown">
                {cid ? (
                  <ul>
                    <li>Sesión iniciada</li>
                    {tipoUsuario === 'admin' && (
                      <li onClick={openAdmin}>Página Admin</li>
                    )}
                  </ul>
                ) : (
                  <ul>
                    <li onClick={openLogin}>Iniciar Sesión</li>
                    <li onClick={openRegister}>Registrarse</li>
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="main-content">
        <h1>Auto Veloz</h1>
        <div className="map-container">
          <img src={mapa} alt="Mapa de España" />
          {offices.map(marker => (
            <div
              key={marker.id}
              style={{
                position: 'absolute',
                top:    marker.top,
                left:   marker.left,
                cursor: 'pointer'
              }}
              onClick={() => handleMarkerClick(marker.id)}
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
            <div className="input-group office-dropdown-container">
              <input
                type="text"
                placeholder="Origen"
                value={origen}
                onFocus={() => setActiveInput('origen')}
                readOnly
              />
              {activeInput === 'origen' && (
                <div className="office-dropdown">
                  <ul>
                    {offices.map(of => (
                      <li key={of.id} onClick={() => handleOfficeSelect(of)}>
                        {of.location}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="input-group office-dropdown-container">
              <input
                type="text"
                placeholder="Destino"
                value={destino}
                onFocus={() => setActiveInput('destino')}
                readOnly
              />
              {activeInput === 'destino' && (
                <div className="office-dropdown">
                  <ul>
                    {offices.map(of => (
                      <li key={of.id} onClick={() => handleOfficeSelect(of)}>
                        {of.location}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="rental-dates">
            <div className="date-time">
              <input
                type="date"
                placeholder="Fecha de inicio"
                value={fechaInicio}
                onChange={e => {
                  setFechaInicio(e.target.value);
                  csetfecharec(e.target.value);
                }}
              />
            </div>
            <div className="date-time">
              <input
                type="date"
                placeholder="Fecha de devolución"
                value={fechaDevolucion}
                onChange={e => {
                  setFechaDevolucion(e.target.value);
                  csetfechadev(e.target.value);
                }}
              />
            </div>
          </div>

          <button className="search-button" onClick={openRenting}>
            Buscar
          </button>
        </div>
      </main>
    </div>
  );
}
