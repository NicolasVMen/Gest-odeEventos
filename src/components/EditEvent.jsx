import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './EditEvent.css';

function EditEvent() {
  const { user } = useAuth();
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/events/${eventId}`, {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        });
        const data = await response.json();
        if (response.ok) {
          setTitle(data.title);
          setDate(data.date.split('T')[0]); // Formato para input type="date"
          setLocation(data.location);
        } else {
          throw new Error(data.message || 'Erro ao buscar evento');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token'),
        },
        body: JSON.stringify({ title, date, location }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Evento atualizado com sucesso!');
        navigate('/admin', { state: { refresh: true } }); // Ajustado para /admin
      } else {
        throw new Error(data.message || 'Erro ao atualizar evento');
      }
    } catch (err) {
      alert(`Erro ao atualizar evento: ${err.message}`);
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return (
    <div>
      <p>Erro: {error}</p>
      <button onClick={() => navigate('/admin', { state: { refresh: true } })} style={{ padding: '5px 10px' }}>
        Voltar
      </button>
    </div>
  );

  return (
    <section className="edit-event">
      <h2>Editar Evento</h2>
      <form onSubmit={handleSubmit} className="edit-event-form">
        <div className="form-group">
          <label>Título:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
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
          <label>Local:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        <button type="submit">Salvar Alterações</button>
        <button type="button" onClick={() => navigate('/admin', { state: { refresh: true } })}>
          Cancelar
        </button>
      </form>
    </section>
  );
}

export default EditEvent;