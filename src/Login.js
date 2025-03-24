import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Ejemplo: credenciales admin/admin
    if (username === "admin" && password === "admin") {
      alert("¡Login exitoso!");
      setError("");
    } else {
      setError("Credenciales inválidas. Intenta de nuevo.");
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
            <label htmlFor="username">Usuario:</label>
            <input
              type="text"
              id="username"
              placeholder="Introduce tu usuario"
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
