// src/components/CreateEvent.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import './CreateEvent.css';

function CreateEvent() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState({ lat: -23.55052, lng: -46.633308 }); // Centro de São Paulo como padrão
  const [address, setAddress] = useState(''); // Endereço decodificado
  const [searchQuery, setSearchQuery] = useState(''); // Texto digitado no campo de busca
  const [suggestions, setSuggestions] = useState([]); // Sugestões de endereços
  const [image, setImage] = useState(null); // Arquivo de imagem
  const [category, setCategory] = useState(''); // Estado para categoria
  const [customCategory, setCustomCategory] = useState(''); // Estado para categoria personalizada
  const [description, setDescription] = useState(''); // Estado para descrição
  const [eventType, setEventType] = useState('Gratuito'); // Estado para tipo do evento
  const [price, setPrice] = useState(''); // Estado para valor do evento
  const [error, setError] = useState(null);

  // Função para buscar sugestões de endereços usando Nominatim
  const handleSearch = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1`
      );
      const data = await response.json();
      setSuggestions(data || []);
    } catch (err) {
      console.error('Erro ao buscar sugestões:', err);
      setSuggestions([]);
    }
  };

  // Função para selecionar uma sugestão
  const handleSelectSuggestion = (suggestion) => {
    const lat = parseFloat(suggestion.lat);
    const lon = parseFloat(suggestion.lon);
    setLocation({ lat, lng: lon });
    setAddress(suggestion.display_name);
    setSearchQuery(suggestion.display_name);
    setSuggestions([]);
  };

  // Componente para atualizar o centro do mapa quando a localização muda
  const RecenterMap = ({ center }) => {
    const map = useMap();
    map.setView(center, map.getZoom());
    return null;
  };

  // Componente para capturar cliques no mapa
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        setLocation({ lat, lng });

        // Usar a API Nominatim para geocodificação reversa
        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
        )
          .then((response) => response.json())
          .then((data) => {
            if (data && data.display_name) {
              setAddress(data.display_name);
              setSearchQuery(data.display_name);
            } else {
              setAddress('Endereço não encontrado');
            }
          })
          .catch((err) => {
            console.error('Erro ao decodificar endereço:', err);
            setAddress('Erro ao buscar endereço');
          });
      },
    });

    return <Marker position={location}></Marker>;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpar erro anterior
    try {
      // Validar a imagem antes de enviar
      if (image) {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        const maxSize = 5 * 1024 * 1024; // 5MB
  
        if (!allowedTypes.includes(image.type)) {
          throw new Error('Apenas imagens JPEG ou PNG são permitidas');
        }
  
        if (image.size > maxSize) {
          throw new Error('A imagem deve ser menor que 5MB');
        }
      }
  
      const formData = new FormData();
      formData.append('title', title);
      formData.append('date', date);
      formData.append('location', address);
      formData.append('category', category === 'Outro' ? customCategory : category);
      formData.append('description', description);
      formData.append('eventType', eventType);
      if (eventType === 'Pago') {
        formData.append('price', price);
      }
      if (image) {
        formData.append('image', image);
      }
  
      // Log para verificar os dados enviados
      console.log('Dados enviados no FormData:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
  
      const response = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: {
          'x-auth-token': localStorage.getItem('token'),
          // Não definir 'Content-Type', o fetch configura automaticamente para FormData
        },
        body: formData,
      });
  
      // Verificar se a resposta é JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Resposta não é JSON: ${text}`);
      }
  
      const data = await response.json();
      if (response.ok) {
        alert('Evento criado com sucesso!');
        navigate('/admin', { state: { refresh: true } });
      } else {
        throw new Error(data.message || 'Erro ao criar evento');
      }
    } catch (err) {
      setError(err.message);
      console.error('Erro:', err.message);
    }
  };

  if (!user || user.role !== 'admin') {
    navigate('/login');
    return null;
  }

  return (
    <section className="create-event">
      <h2>Criar Novo Evento</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="create-event-form" encType="multipart/form-data">
        <div className="form-group">
          <label>Título:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Digite o título do evento"
          />
        </div>
        <div className="form-group">
          <label>Categoria:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Selecione uma categoria</option>
            <option value="Palestra Inspiradora">Palestra Inspiradora</option>
            <option value="Workshop Interativo">Workshop Interativo</option>
            <option value="Festa Tecnológica">Festa Tecnológica</option>
            <option value="Feira de Profissões">Feira de Profissões</option>
            <option value="Feira Tecnológica">Feira Tecnológica</option>
            <option value="Hackathon">Hackathon</option>
            <option value="Seminário de Inovação">Seminário de Inovação</option>
            <option value="Exposição Tech">Exposição Tech</option>
            <option value="Encontro de Networking">Encontro de Networking</option>
            <option value="Competição de Startups">Competição de Startups</option>
            <option value="Outro">Outro</option>
          </select>
        </div>
        {category === 'Outro' && (
          <div className="form-group">
            <label>Categoria Personalizada:</label>
            <input
              type="text"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="Digite a categoria do evento"
              required
            />
          </div>
        )}
        <div className="form-group">
          <label>Descrição:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva o evento"
            required
            rows="5"
          />
        </div>
        <div className="form-group">
          <label>Data:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Tipo do Evento:</label>
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            required
          >
            <option value="Gratuito">Gratuito</option>
            <option value="Pago">Pago</option>
          </select>
        </div>
        {eventType === 'Pago' && (
          <div className="form-group">
            <label>Valor do Evento (R$):</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Digite o valor do evento"
              min="0"
              step="0.01"
              required
            />
          </div>
        )}
        <div className="form-group">
          <label>Localização:</label>
          <div className="location-search">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearch(e.target.value);
              }}
              placeholder="Digite o local do evento"
            />
            {suggestions.length > 0 && (
              <ul className="suggestions-list">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleSelectSuggestion(suggestion)}
                    className="suggestion-item"
                  >
                    {suggestion.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <MapContainer
            center={location}
            zoom={12}
            style={{ height: '400px', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <RecenterMap center={location} />
            <LocationMarker />
          </MapContainer>
          <p className="selected-address">
            Endereço Selecionado: {address || 'Clique no mapa ou digite para selecionar um local'}
          </p>
        </div>
        <div className="form-group">
          <label>Imagem do Evento (opcional):</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {image && (
            <div className="image-preview">
              <img src={URL.createObjectURL(image)} alt="Prévia da imagem" />
            </div>
          )}
        </div>
        <div className="form-buttons">
          <button type="submit" className="submit-btn">
            Criar Evento
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate('/')}
          >
            Cancelar
          </button>
        </div>
      </form>
    </section>
  );
}

export default CreateEvent;