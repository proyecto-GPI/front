import React, { useState } from 'react';
import "./Renting.css"; // Importamos el CSS

const Renting = () => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [activeCar, setActiveCar] = useState(null);

  const cars = [
    {
      id: 1,
      name: "Tesla Model 3",
      image: "https://source.unsplash.com/400x250/?tesla",
      price: "499€/mes",
      features: ["Eléctrico", "Autonomía 500km", "0-100km/h en 3.1s"],
    },
    {
      id: 2,
      name: "BMW Serie 3",
      image: "https://source.unsplash.com/400x250/?bmw",
      price: "399€/mes",
      features: ["Motor 2.0L", "Autonomía 800km", "Caja automática"],
    },
    {
      id: 3,
      name: "Audi A4",
      image: "https://source.unsplash.com/400x250/?audi",
      price: "429€/mes",
      features: ["Tracción Quattro", "Pantalla digital", "Asientos de cuero"],
    },
  ];

  const extras = ["GPS", "Seguro", "Silla infantil", "WiFi"];

  const togglePopup = (car) => {
    setActiveCar(car); // Actualizamos el estado con el coche seleccionado
    setPopupVisible(!popupVisible);
  };

  const handleExtraChange = (extra) => {
    setSelectedExtras((prevExtras) =>
      prevExtras.includes(extra)
        ? prevExtras.filter((e) => e !== extra)
        : [...prevExtras, extra]
    );
  };

  return (
    <div className="renting-container">
      <h1>Renting de Coches</h1>
      <p>Elige el coche ideal para tu movilidad</p>

      <div className="cars-list">
        {cars.map((car) => (
          <div key={car.id} className="car-card">
            <img src={car.image} alt={car.name} />
            <h2>{car.name}</h2>
            <p className="price">{car.price}</p>
            <ul>
              {car.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <button className="rent-button" onClick={() => togglePopup(car)}>
              Más detalles
            </button>
          </div>
        ))}
      </div>

      {popupVisible && activeCar && (
        <div className="popup">
          <div className="popup-content">
            <h2>{activeCar.name}</h2> {/* Muestra el nombre del coche */}
            <p className="price">{activeCar.price}</p>
            <h3>Extras Disponibles</h3>
            <ul>
              {extras.map((extra) => (
                <li key={extra}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedExtras.includes(extra)}
                      onChange={() => handleExtraChange(extra)}
                    />
                    {extra}
                  </label>
                </li>
              ))}
            </ul>
            <button className="close-popup" onClick={() => setPopupVisible(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Renting;
