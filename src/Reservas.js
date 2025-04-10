import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Reservas.css";

const Reservas = () => {
  const navigate = useNavigate();
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica para procesar el pago y confirmar la reserva
    alert("Reserva confirmada!");
    navigate("/"); // Redirige a la página principal o a una de confirmación
  };

  return (
    <div className="reservas-container">
      <h1>Introduzca su tarjeta de crédito</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Número de Tarjeta:</label>
          <input 
            type="text" 
            value={cardNumber} 
            onChange={(e) => setCardNumber(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Nombre del Titular:</label>
          <input 
            type="text" 
            value={cardHolder} 
            onChange={(e) => setCardHolder(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Fecha de Expiración:</label>
          <input 
            type="text" 
            placeholder="MM/YY" 
            value={expiry} 
            onChange={(e) => setExpiry(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>CVV:</label>
          <input 
            type="text" 
            value={cvv} 
            onChange={(e) => setCvv(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Confirmar Reserva</button>
      </form>
    </div>
  );
};

export default Reservas;
