// Register.js
import React, { useState, useContext } from 'react';
import './Register.css';
import { useNavigate } from 'react-router-dom';
import { AppContext } from './AppContext'; // Ajusta la ruta según corresponda

function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dni, setDni] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); 

  // Obtén los setters del contexto
  const { 
    csetFirstName,
    csetLastName,
    csetDni,
    csetEmail,
    csetPassword,
    csetConfirmPassword,
    cofinicio,
    cSetid
  } = useContext(AppContext);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    // Construir el objeto con los datos que espera la API
    const registerData = {
      correo: email,
      contrasenya: password,
      nombre: `${firstName} ${lastName}`,
      id: dni,
      tipo_cliente: "particular"  // Puedes cambiarlo según corresponda
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(registerData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.detail || "Error en el registro");
        //provisional
        cSetid(dni);
        setError("");
        navigate("/");
        return;
      }
      
      // Si la respuesta es exitosa, procesamos los datos recibidos
      const data = await response.json();

      // Actualiza las variables del contexto
      csetFirstName(firstName);
      csetLastName(lastName);
      csetDni(dni);
      csetEmail(email);
      csetPassword(password);
      csetConfirmPassword(confirmPassword);
      // Suponiendo que la API devuelve un id, actualízalo. Sino, puedes usar dni u otro valor
      cSetid(dni);

      setError("");
      // Navega a la página principal ("/")
      if(cofinicio){
        navigate("/renting");
      }
      else{
        console.log(cofinicio);
        navigate("/");

      }
    } catch (err) {
      console.error("Error en el registro:", err);
      setError("Se ha producido un error inesperado. Por favor, inténtalo más tarde.");
              //provisional
              cSetid(dni);
              setError("");
              navigate("/");
              return;
    }
  };

  return (
    <div className="register-page">
      <div className="register-form-container">
        <h2>Registro de usuario</h2>
        <form onSubmit={handleRegister}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">Nombre:</label>
              <input
                type="text"
                id="firstName"
                placeholder="Nombre"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Apellidos:</label>
              <input
                type="text"
                id="lastName"
                placeholder="Apellidos"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="dni">DNI:</label>
            <input
              type="text"
              id="dni"
              placeholder="DNI"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Correo electrónico:</label>
            <input
              type="email"
              id="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirmar Contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" className="register-button">Confirmar Registro</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
