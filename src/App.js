import React, { useState, useContext, useEffect } from 'react';
import { FaUser, FaMapMarkerAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import mapa from './mapa.jpg';
import './App.css';
import { AppContext } from './AppContext'; 

function App() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [activeMarker, setActiveMarker] = useState(null);
  const [activeInput, setActiveInput] = useState(null);
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');
  const [idOrigen, setIdOrigen] = useState(null);
  const [idDestino, setIdDestino] = useState(null);
  const [offices, setOffices] = useState([]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaDevolucion, setFechaDevolucion] = useState("");
  const navigate = useNavigate();

  // Se asume que AppContext provee todos estos valores y setters
  const { cid, cSetid, cofinicio, csetofinicio, cofinal, csetofinal, csetfecharec, csetfechadev } = useContext(AppContext);

  // Realizamos el fetch de las oficinas al cargar el componente
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/oficinas")
      .then(response => {
        if (!response.ok) {
          throw new Error("Fetch fallido");
        }
        return response.json();
      })
      .then(data => {
        setOffices(data);
      })
      .catch(error => {
        console.error("Error fetching offices:", error);
        // Si el fetch falla, se establece una oficina por defecto
        setOffices([{ id_oficina: 999, direccion: "Oficina por defecto, Ciudad" }]);
      });
  }, []);

  const markers = [
    /*{
      id: 1,
      name: "Oficina Madrid",
      location: "Calle Mayor, 1, Madrid",
      top: '35%',
      left: '37%'
    },
    {
      id: 2,
      name: "Oficina Barcelona",
      location: "Av. Diagonal, 123, Barcelona",
      top: '21%',
      left: '78%'
    },
    {
      id: 3,
      name: "Oficina Rota",
      location: "Calle Cañailla, 35, Rota",
      top: '70%',
      left: '28%'
    },
    {
      id: 4,
      name: "Oficina Galicia",
      location: "Calle Mártires, 15, Galicia",
      top: '10%', 
      left: '10%'
    }*/
    {
      id: 5,
      name: "Oficina Prueba",
      location: "xxxxx",
      top: '13%', 
      left: '45%'
    }
  ];

  /*COORDENADAS MAPA PARA LAS SIGUIENTES PROVINCIAS (para ciudades más concretas jugar un poco con top/left, pero por tener idea):
  - Andalucía: 
     Almería --> top: '70%', left: '46%'
     Cádiz --> top: '76%', left: '21%'
     Córdoba --> top: 63%', left: '29%'
     Granada --> top: '70%', left: '38%'
     Huelva --> top: '66%', left: '14%'
     Jaén --> top: '62%', left: '37%'
     Málaga --> top: '74%', left: '29%'
     Sevilla --> top: '67%', left: '22%'
  - Aragón: 
     Huesca --> top: '15%', left: '63%'
     Teruel --> top: ' 33%', left: '58%'
     Zaragoza --> top: ' 21.5%', left: '56%'
  - Asturias:
     Asturias --> top: ' 3%', left: '23%'
  - Cantabria: 
     Cantabria --> top: ' 3%', left: ' 34%'
  - Castilla y León: 
     Ávila --> top: ' 34%', left: ' 28%'
     Burgos --> top: ' 16%', left: ' 38%'
     León --> top: ' 12%', left: ' 23%'
     Palencia --> top: ' 12%', left: ' 30.5%'
     Salamanca --> top: ' 31%', left: ' 21%'
     Segovia --> top: ' 27%', left: ' 34%'
     Soria --> top: ' 21%', left: ' 45%'
     Valladolid --> top: ' 21%', left: ' 30%'
     Zamora --> top: ' 20%', left: ' 23%'
  - Castilla-La Mancha: 
     Albacete --> top: ' 52%', left: ' 50%'
     Ciudad Real --> top: ' 52%', left: ' 50%'
     Cuenca --> top: ' 52%', left: ' 37%'
     Guadalajara --> top: ' 32%', left: ' 45%'
     Toledo --> top: ' 41%', left: ' 46%'
  - Cataluña: 
     Barcelona --> top: '21%', left: '78%'
     Gerona --> top: '17%', left: '83%'
     Lérida --> top: '17%', left: '72%'
     Tarragona --> top: '25.75%', left: '70%'
  - Extremadura: 
     Badajoz --> top: '56%', left: '18%'
     Cáceres --> top: '42%', left: '23%'
  - Galicia: 
     La Coruña --> top: '3%', left: '7%'
     Lugo --> top: '4%', left: '12%'
     Orense --> top: '15%', left: '13%'
     Pontevedra --> top: '12%', left: '15%'
  - Islas Baleares: 
     Menorca --> top: '52%', left: '92%'
     Mallorca --> top: '56%', left: '82%'
     Ibiza --> top: '64.5%', left: '70%'
     Formetera --> top: '68.5%', left: '71%'
  - Islas Canarias (NO ESTAN)
     La Palma
     El Hierro
     La Gomera
     Tenerife
     Gran Canaria
     Lanzarote
     Fuerteventura  
  - La Rioja: 
     La Rioja --> top: '13%', left: '45%'
  - Madrid: 
     Madrid  --> top: '35%', left: '37%'
  - Murcia: 
     Murcia 
  - Navarra: 
     Navarra --> top: '10%', left: '51%'
  - País Vasco: 
     Álava
     Guipúzcoa
     Vizcaya 
  - Valencia: 
     Alicante
     Castellón
     Valencia
  */ 

  function toggleDropdown() {
    setDropdownVisible(!dropdownVisible);
  }

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
    // Si el usuario no ha iniciado sesión, redirige a login
    if (!cid) {
      navigate("/login");
      return;
    }
    // Si ha iniciado sesión, se debe haber seleccionado ambas oficinas
    if (idOrigen && idDestino) {
      csetofinicio(idOrigen);
      csetofinal(idDestino);
      navigate("/renting");
    } else {
      alert("Por favor, selecciona ambas oficinas: Origen y Destino");
    }
    setDropdownVisible(false);
  };

  const handleOfficeSelect = (office) => {
    if (activeInput === 'origen') {
      csetofinicio(office);
      setOrigen(office.direccion);
      setIdOrigen(office.id_oficina);
    } else if (activeInput === 'destino') {
      csetofinal(office);
      setDestino(office.direccion);
      setIdDestino(office.id_oficina);
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
                    {offices.map(office => (
                      <li 
                        key={office.id_oficina}
                        onClick={() => handleOfficeSelect(office)}
                      >
                        {office.direccion}
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
                    {offices.map(office => (
                      <li 
                        key={office.id_oficina}
                        onClick={() => handleOfficeSelect(office)}
                      >
                        {office.direccion}
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
                onChange={(e) => {
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
                onChange={(e) => {
                  setFechaDevolucion(e.target.value);
                  csetfechadev(e.target.value);
                }}
              />
            </div>
          </div>

          <button className="search-button" onClick={openRenting}>Buscar</button>
        </div>
      </main>
    </div>
  );
}

export default App;
