import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app.jsx';
import 'leaflet/dist/leaflet.css'; // Adicionar o CSS do Leaflet
import L from 'leaflet'; // Importar o Leaflet para corrigir os ícones

// Corrige os ícones padrão do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);