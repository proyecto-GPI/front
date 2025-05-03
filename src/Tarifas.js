// src/Tarifas.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaInfoCircle, FaHome } from 'react-icons/fa';
import './Tarifas.css';

const tarifasData = [
  {
    id: 'larga',
    label: 'Larga duración',
    options: [
      { id: 'op1', price: '50€', info: 'Ideal para alquileres de más de 1 mes.' },
      { id: 'op2', price: '45€', info: 'Descuento por contrato semestral.' }
    ]
  },
  {
    id: 'corta',
    label: 'Corta duración',
    options: [
      { id: 'op1', price: '10€', info: 'Tarifa por día.' },
      { id: 'op2', price: '60€', info: 'Paquete semanal.' }
    ]
  },
  {
    id: 'estacional',
    label: 'Estacional',
    options: [
      { id: 'op1', price: '30€', info: 'Solo verano.' },
      { id: 'op2', price: '20€', info: 'Temporada baja.' }
    ]
  },
  {
    id: 'kilometraje',
    label: 'Kilometraje',
    options: [
      { id: 'op1', price: '0.20€/km', info: 'Pago por kilómetro recorrido.' },
      { id: 'op2', price: '100€', info: 'Kilometraje ilimitado.' }
    ]
  }
];

export default function Tarifas() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showInfoFor, setShowInfoFor] = useState(null);
  const [error, setError] = useState('');
  const containerRef = useRef(null);

  const handleSelect = (tarifaId, optionId) => {
    setSelectedOption({ tarifaId, optionId });
    setError('');
  };

  const handleInfo = (tarifaId, optionId) => {
    const key = `${tarifaId}-${optionId}`;
    setShowInfoFor(prev => (prev === key ? null : key));
  };

  const handleProceed = () => {
    if (!selectedOption) {
      setError('Debe seleccionar una opción antes de proceder');
    } else {
      console.log('Proceder con:', selectedOption);
      // futura lógica de pago
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (showInfoFor) {
        const box = containerRef.current.querySelector('.info-box');
        const icon = event.target.closest('.info-icon');
        if (box && !box.contains(event.target) && !icon) {
          setShowInfoFor(null);
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showInfoFor]);

  return (
    <div className="tarifas-container" ref={containerRef}>
      <Link to="/" className="tarifas-home" aria-label="Inicio">
        <FaHome size={24} title="Home" />
      </Link>
      <h2 className="tarifas-title">Seleccione una tarifa de entre las siguientes</h2>
      <div className="tarifas-list">
        {tarifasData.map(t => (
          <div key={t.id} className="tarifa-block">
            <h3 className="tarifa-label">{t.label}</h3>
            {t.options.map(opt => {
              const key = `${t.id}-${opt.id}`;
              const isSelected = selectedOption?.tarifaId === t.id && selectedOption?.optionId === opt.id;
              const showInfo = showInfoFor === key;
              return (
                <div key={opt.id} className="tarifa-option">
                  <span className="option-name">{opt.id}</span>
                  <span className="option-price">{opt.price}</span>
                  <FaInfoCircle className="info-icon" onClick={() => handleInfo(t.id, opt.id)} />
                  <input
                    type="radio"
                    name="tarifa-select"
                    checked={isSelected}
                    onChange={() => handleSelect(t.id, opt.id)}
                  />
                  {showInfo && (
                    <div className="info-box">
                      <p>{opt.info}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {error && <div className="error-msg">{error}</div>}
      <button className="proceed-btn" onClick={handleProceed}>Proceder al pago</button>
    </div>
  );
}
