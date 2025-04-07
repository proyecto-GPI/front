import React, { useState } from 'react';
import "./Renting.css";
import { useLocation } from 'react-router-dom';

const Renting = () => {
  const location = useLocation();
  const cars = location.state?.cars || [];
  const returnDetails = location.state?.returnDetails;

  return (
    <div className="renting-container">
      <h1>Renting de Coches</h1>
      <p>Elige el coche ideal para tu movilidad</p>

      <div className="cars-list">
        {cars.length > 0 ? (
          cars.map((car) => (
            <div key={car.id} className="car-card">
              <h2>{car.modelo}</h2>
              <p>Categoría: {car.categoria}</p>
              <p>Puertas: {car.puertas}</p>
              <p>Tipo de cambio: {car.tipo_cambio === "m" ? "Manual" : "Automático"}</p>
              <p>Techo solar: {car.techo_solar ? "Sí" : "No"}</p>
            </div>
          ))
        ) : (
          <p>No hay coches disponibles en este momento.</p>
        )}
      </div>
    </div>
  );
};


export default Renting;
