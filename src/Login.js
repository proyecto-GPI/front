import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        // Se envían los datos en el formato que espera la API: email y password.
        body: JSON.stringify({ correo: username, contrasenya: password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.detail || "Error en la autenticación");
        return;
      }
      
      const data = await response.json();
      const userid = data.id;
      alert("¡Login exitoso!");
      setError("");
      // Aquí puedes guardar datos (por ejemplo, un token o el id) y redirigir
      navigate("/dashboard");
    } catch (err) {
      console.error("Error en el login:", err);
      setError("Error interno. Inténtalo más tarde.");
    }
  };

  const handleCreateAccount = () => {
    navigate("/register");
  };

  return (
    <div className="login-page">
      <div className="login-form-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Email:</label>
            <input
              type="text"
              id="username"
              placeholder="Introduce tu email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              placeholder="Introduce tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="button" className="forgot-password">
            ¿Olvidaste tu contraseña?
          </button>
          <div className="button-row">
            <button type="button" className="create-account" onClick={handleCreateAccount}>
              Crear cuenta
            </button>
            <button type="submit" className="login-button">
              Acceder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
