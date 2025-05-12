import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaInfoCircle, FaHome } from 'react-icons/fa';
import './Tarifas.css';

export default function Tarifas() {
  const [tarifas, setTarifas] = useState([]);
  const [selectedTarifa, setSelectedTarifa] = useState(null);
  const [showInfoFor, setShowInfoFor] = useState(null);
  const [error, setError] = useState('');
  const containerRef = useRef(null);

  // Fetch all tarifas on mount
  useEffect(() => {
    const fetchTarifas = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/tarifas/all');
        if (!res.ok) throw new Error('Network error fetching tarifas');
        const data = await res.json();
        setTarifas(data);
      } catch (err) {
        console.error(err);
        setError('Error al cargar tarifas');
      }
    };
    fetchTarifas();
  }, []);

  const handleSelect = (id) => {
    setSelectedTarifa(id);
    setError('');
  };

  const handleInfo = (id) => {
    setShowInfoFor(prev => (prev === id ? null : id));
  };

  const handleProceed = () => {
    if (!selectedTarifa) {
      setError('Debe seleccionar una tarifa antes de proceder');
    } else {
      console.log('Proceder con tarifa:', selectedTarifa);
      // lógica de pago futura
    }
  };

  // Cierra tooltip fuera
  useEffect(() => {
    function handleClickOutside(e) {
      const box = containerRef.current?.querySelector('.info-box');
      const icon = e.target.closest('.info-icon');
      if (showInfoFor && box && !box.contains(e.target) && !icon) {
        setShowInfoFor(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showInfoFor]);

  return (
    <div className="tarifas-container" ref={containerRef}>
      <Link to="/" className="tarifas-home" aria-label="Inicio">
        <FaHome size={40} title="Home" />
      </Link>
      <h2 className="tarifas-title">Seleccione una tarifa</h2>

      {error && <div className="error-msg">{error}</div>}

      <div className="tarifas-list">
        {tarifas.map(t => {
          const key = t.id_tarifa;
          const isSelected = selectedTarifa === key;
          const showInfo = showInfoFor === key;
          return (
            <div key={key} className={`tarifa-block ${isSelected ? 'selected' : ''}`}>
              <div className="tarifa-header">
                <input
                  type="radio"
                  id={`tarifa-${key}`}
                  name="tarifa-select"
                  checked={isSelected}
                  onChange={() => handleSelect(key)}
                />
                <label htmlFor={`tarifa-${key}`}>{t.tipo_tarifa} ({t.periodo})</label>
              </div>
              <div className="tarifa-details">
                <span className="option-price">{t.precio_por_unidad}€/unidad</span>
                <FaInfoCircle
                  className="info-icon"
                  onClick={() => handleInfo(key)}
                />
                {showInfo && (
                  <div className="info-box">
                    <p>Precio total estimado: {t.precio_total}€</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <button className="proceed-btn" onClick={handleProceed}>Proceder al pago</button>
    </div>
  );
}
