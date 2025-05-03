// Reservas.js
import React, { useState, useContext, useEffect } from 'react'; // Asegúrate de importar useEffect si necesitas limpiar timeouts (aunque aquí no es estrictamente necesario por la navegación)
import { AppContext } from './AppContext';
import './Reservas.css'; // Importa el CSS
import { useNavigate } from 'react-router-dom';

// --- Funciones de formato (sin cambios) ---
const formatDate = (dateStr) => {
    // ... (mantener la función formatDate como estaba)
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};
// --- Fin Funciones de formato ---


function Reservas() {
    const navigate = useNavigate();
    const { cid, cofinicio, idcoche, cfecharec, cfechadev } = useContext(AppContext);
    const [numTarjeta, setNumTarjeta] = useState('');
    const [loading, setLoading] = useState(false); // Indica carga general (API o espera)
    const [error, setError] = useState(null);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false); // Nuevo estado para mensaje de éxito

    // Podrías usar useRef para el timeout si necesitaras limpiarlo,
    // pero como navegamos, no es crítico aquí.
    // const timeoutRef = useRef(null);

    const handleConfirm = (e) => {
        e.preventDefault();
        // Resetea estados antes de empezar
        setError(null);
        setShowSuccessMessage(false);
        setLoading(true); // Inicia la carga (muestra spinner, deshabilita botón)

        // Validaciones básicas (mantener las de antes)
        if (!cid || !cofinicio || !idcoche || !cfecharec || !cfechadev || !numTarjeta) {
            setError("Por favor, asegúrate de que todos los datos de la reserva y la tarjeta están completos.");
            setLoading(false);
            return;
        }
        if (numTarjeta.replace(/\s/g, '').length < 13 || numTarjeta.replace(/\s/g, '').length > 19) {
            setError("El número de tarjeta parece inválido.");
            setLoading(false);
            return;
        }

        const payload = {
            id_user: cid,
            id_oficina: cofinicio,
            id_coche: idcoche,
            fecha_recogida: formatDate(cfecharec),
            fecha_devolucion: formatDate(cfechadev),
            num_tarjeta: numTarjeta.replace(/\s/g, '')
        };

        console.log("Enviando payload:", payload);

        fetch('http://127.0.0.1:8000/api/reserve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(resp => {
                if (!resp.ok) {
                    return resp.json().catch(() => null).then(errorData => {
                        console.error("Error response:", resp.status, errorData);
                        throw new Error(errorData?.detail || `Error ${resp.status}: Error al realizar la reserva`);
                    });
                }
                return resp.json();
            })
            .then(data => {
                console.log('Reserva exitosa:', data);
                // Éxito: Muestra mensaje y prepara la navegación
                setShowSuccessMessage(true); // Muestra "Reserva realizada correctamente"
                // Mantenemos setLoading(true) para que el spinner siga visible durante la espera

                // Espera 2 segundos antes de navegar
                // clearTimeout(timeoutRef.current); // Limpia timeout previo si existiera
                // timeoutRef.current = setTimeout(() => {
                setTimeout(() => {
                    navigate('/listareservas');
                    // Opcional: resetear estados al salir, aunque no es vital si el componente se desmonta
                    // setLoading(false);
                    // setShowSuccessMessage(false);
                }, 2000); // 2000 milisegundos = 2 segundos

            })
            .catch(err => {
                console.error('Error en catch:', err);
                setError(err.message); // Muestra el error
                setLoading(false); // Detiene la carga (quita spinner, habilita botón)
                setShowSuccessMessage(false); // Asegura que no se muestre el mensaje de éxito
            });
    };

    return (
        <div className="reserva-page">
            <div className="reserva-form-container">
                <h1>Confirmar Reserva</h1>
                <form onSubmit={handleConfirm}>
                    <div className="form-group">
                        <label htmlFor="numTarjeta">Número de Tarjeta</label>
                        <input
                            id="numTarjeta"
                            type="text"
                            inputMode="numeric"
                            pattern="[\d\s]{13,19}"
                            autoComplete="cc-number"
                            value={numTarjeta}
                            onChange={(e) => setNumTarjeta(e.target.value)}
                            placeholder="•••• •••• •••• ••••"
                            required
                            disabled={loading} // Deshabilita input mientras carga/espera
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {/* Mostrar spinner si está cargando Y no se muestra el mensaje de éxito aún */}
                        {loading && !showSuccessMessage && <div className="spinner"></div>}
                        {/* Mostrar spinner también si se muestra el mensaje de éxito (durante los 2s) */}
                        {loading && showSuccessMessage && <div className="spinner"></div>}
                        {/* Mostrar texto solo si no está cargando */}
                        {!loading && 'Confirmar y Pagar'}
                         {/* El texto del mensaje de éxito irá fuera del botón */}
                    </button>
                </form>

                 {/* Muestra el mensaje de éxito si showSuccessMessage es true */}
                 {showSuccessMessage && (
                    <p className="success-message">Reserva realizada correctamente</p>
                 )}

                {/* Muestra el error si existe y no estamos mostrando el mensaje de éxito */}
                {error && !showSuccessMessage && <p className="error">Error: {error}</p>}

                {/* El mensaje de carga genérico ya no es necesario si el botón lo indica */}
                {/* {loading && !showSuccessMessage && <p className="loading">Procesando...</p>} */}

            </div>
        </div>
    );
}

export default Reservas;