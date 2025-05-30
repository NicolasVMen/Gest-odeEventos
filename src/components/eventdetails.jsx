// src/components/EventDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './EventDetails.css';

function EventDetails() {
  const { id } = useParams(); // Obtém o ID do evento da URL
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/events/${id}`);
        const data = await response.json();
        if (response.ok) {
          setEvent(data);
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
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja excluir este evento?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      });

      if (response.ok) {
        alert('Evento excluído com sucesso!');
        navigate('/admin', { state: { refresh: true } });
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Erro ao excluir evento');
      }
    } catch (err) {
      alert(`Erro ao excluir evento: ${err.message}`);
    }
  };

  const handleEdit = () => {
    // Redirecionar para uma página de edição (pode ser implementada depois)
    alert('Funcionalidade de edição ainda não implementada.');
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!event) return <p>Evento não encontrado.</p>;

  return (
    <section className="event-details">
      <h2>{event.title}</h2>
      <div className="event-details-content">
        <div className="event-image">
          {event.image ? (
            <img src={event.image} alt={event.title} />
          ) : (
            <p>Sem imagem disponível</p>
          )}
        </div>
        <div className="event-info">
          <p><strong>Categoria:</strong> {event.category}</p>
          <p><strong>Descrição:</strong> {event.description}</p>
          <p>
            <strong>Data:</strong>{' '}
            {new Date(event.date).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
          </p>
          <p><strong>Local:</strong> {event.location}</p>
          <p><strong>Tipo do Evento:</strong> {event.eventType}</p>
          {event.eventType === 'Pago' && (
            <p><strong>Valor:</strong> R$ {event.price}</p>
          )}
          <p><strong>Participantes:</strong> {event.participants.length}</p>
          {event.participants.length > 0 && (
            <div className="participants-list">
              <h4>Lista de Participantes:</h4>
              <ul>
                {event.participants.map((participant, index) => (
                  <li key={index}>
                    {participant.user?.name || 'Usuário Desconhecido'} - Inscrito em{' '}
                    {new Date(participant.registeredAt).toLocaleDateString('pt-BR')}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {event.comments.length > 0 && (
            <div className="comments-list">
              <h4>Comentários:</h4>
              <ul>
                {event.comments.map((comment, index) => (
                  <li key={index}>
                    <strong>{comment.user?.name || 'Usuário Desconhecido'}:</strong> {comment.text} -{' '}
                    {new Date(comment.createdAt).toLocaleDateString('pt-BR')}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {event.ratings.length > 0 && (
            <div className="ratings-list">
              <h4>Avaliações:</h4>
              <ul>
                {event.ratings.map((rating, index) => (
                  <li key={index}>
                    <strong>{rating.user?.name || 'Usuário Desconhecido'}:</strong> {rating.score} ★ -{' '}
                    {new Date(rating.createdAt).toLocaleDateString('pt-BR')}
                  </li>
                ))}
              </ul>
              <p>
                <strong>Média das Avaliações:</strong>{' '}
                {(event.ratings.reduce((sum, r) => sum + r.score, 0) / event.ratings.length).toFixed(1)} ★
              </p>
            </div>
          )}
        </div>
      </div>
      {user && user.role === 'admin' && (
        <div className="admin-actions">
          <button className="edit-btn" onClick={handleEdit}>
            Editar Evento
          </button>
          <button className="delete-btn" onClick={handleDelete}>
            Excluir Evento
          </button>
          <button className="back-btn" onClick={() => navigate('/admin')}>
            Voltar
          </button>
        </div>
      )}
    </section>
  );
}

export default EventDetails;