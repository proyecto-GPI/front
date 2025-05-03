import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import App from './App';
import Login from './Login';
import Register from './Register';
import Renting from './Renting';
import Reservas from './Reservas';
import ListaReservas from './ListaReservas';
import Admin from './Admin';
import Tarifas from './Tarifas';

import reportWebVitals from './reportWebVitals';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './AppContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/renting" element={<Renting />} />
          <Route path="/reservas" element={<Reservas />} />
          <Route path="/listareservas" element={<ListaReservas />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/tarifas" element={<Tarifas />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  </React.StrictMode>
);

reportWebVitals();
