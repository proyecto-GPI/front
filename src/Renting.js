import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Renting.css";
import { AppContext } from './AppContext'; // Ajusta la ruta según corresponda

const Renting = () => {
  const navigate = useNavigate();
  const { 
    cid, 
    cSetid, 
    cofinicio, 
    csetofinicio, 
    cofinal,        // id_oficina
    csetofinal,
    cfecharec,      // fecha_inicio
    csetfecharec,
    cfechadev,      // fecha_fin
    csetfechadev,
    cidcoche,       // id del coche seleccionado
    csetidcoche     // setter para el id del coche
  } = useContext(AppContext);

  // Lista dummy de coches
  const dummyCars = [
    {
      id: 1,
      techo_solar: true,
      puertas: 5,
      tipo_cambio: "m",
      modelo: "Golf GTI",
      categoria: "media"
    },
    {
      id: 2,
      techo_solar: true,
      puertas: 4,
      tipo_cambio: "a",
      modelo: "Model 0",
      categoria: "alta"
    }
  ];

  // Estado para la lista de coches disponibles, inicialmente con la dummy
  const [cars, setCars] = useState(dummyCars);

  // Función para convertir la fecha del input (YYYY-MM-DD) al formato requerido: dd/MM/yyyy 00:00:00
 const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    // Asigna la hora, minutos y segundos deseados
    date.setHours(1, 1, 1);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  // Efecto que hace el fetch a la API al cargar la página o cuando cambian las fechas o el id de oficina
  useEffect(() => {
    const fetchAvailability = async () => {
      // No ejecutar el fetch si no tenemos las fechas o el id de oficina

      

      if (!cofinicio || !cfecharec || !cfechadev) return;


      const fechaInicioFormato = formatDate(cfecharec);
      const fechaFinFormato = formatDate(cfechadev);
      console.log(fechaInicioFormato)
      console.log(fechaFinFormato)
      // Construir los parámetros de la URL
      const params = new URLSearchParams({
        id_oficina: cofinicio,
        fecha_inicio: fechaInicioFormato,
        fecha_fin: fechaFinFormato,
      });
      console.log(params);
      
      const url = `http://127.0.0.1:8000/api/availability?${params.toString()}`;
      
      try {
        const response = await fetch(url);


        console.log("Resultado consola:", response);

        if (!response.ok) {
          throw new Error("Error en la respuesta de la API");
        }
        const data = await response.json();
        // Se espera que 'data' tenga la misma estructura que dummyCars
        setCars(data);
      } catch (error) {
        console.error("Error fetching cars availability:", error);
        // Si falla el fetch se mantiene la lista dummy
        setCars(dummyCars);
      }
    };


    fetchAvailability();
  }, [cofinicio, cfecharec, cfechadev]);

  // Función para transformar el tipo de cambio a un formato legible
  const convertTipoCambio = (tipo) => {
    return tipo === "m" ? "Manual" : "Automático";
  };

  // Función para seleccionar un coche, almacena el id en el contexto y redirige a /reservas
  const handleSelectCar = (car) => {
    // Almacena el id del coche seleccionado en la variable de contexto
    csetidcoche(car.id);
    navigate("/tarifas");
  };

  return (
    <div className="renting-container">
      <h1>Renting de Coches</h1>
      <p>Elige el coche ideal para tu movilidad</p>

      <div className="cars-list">
        {cars.map((car) => (
          <div key={car.id} className="car-card">
            <img 
              src={`https://via.placeholder.com/400x250?text=${encodeURIComponent(car.modelo)}`} 
              alt={car.modelo} 
            />
            <h2>{car.modelo}</h2>
            <p className="price">Categoría: {car.categoria}</p>
            <ul>
              <li>Techo Solar: {car.techo_solar ? "Sí" : "No"}</li>
              <li>Puertas: {car.puertas}</li>
              <li>Tipo de Cambio: {convertTipoCambio(car.tipo_cambio)}</li>
            </ul>
            <button onClick={() => handleSelectCar(car)}>Seleccionar</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Renting;
