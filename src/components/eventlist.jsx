// src/components/EventList.jsx
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import banner1 from '../assets/banner1.jpg';
import banner2 from '../assets/banner2.jpg';
import banner3 from '../assets/banner3.jpg';
import './EventList.css';

function EventList({ scrollToEvents, limit }) {
  const { user, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [commentText, setCommentText] = useState({});
  const [ratingScore, setRatingScore] = useState({});
  const [expandedComments, setExpandedComments] = useState({});

  const banners = [banner1, banner2, banner3];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/events');
        if (!response.ok) {
          throw new Error('Erro ao buscar eventos');
        }
        const data = await response.json();
        setEvents(limit ? data.slice(0, limit) : data);
      } catch (err) {
        console.error('Erro ao buscar eventos:', err);
        setEvents([]);
      }
    };

    fetchEvents();
  }, [limit]);

  const toggleComments = (eventId) => {
    setExpandedComments(prev => ({
      ...prev,
      [eventId]: !prev[eventId],
    }));
  };

  const handleRegister = async (eventId) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (!user || !user.id) {
      alert('Erro: Usuário não possui um ID válido. Faça login novamente.');
      return;
    }

    const event = events.find(event => event._id === eventId);
    if (isUserRegistered(event)) {
      alert('Você já está inscrito neste evento!');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/events/${eventId}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token'),
        },
      });

      const data = await response.json();
      console.log('Dados retornados do backend (handleRegister):', data);
      if (response.ok) {
        setEvents(prevEvents =>
          prevEvents.map(event =>
            event._id === eventId ? { ...event, ...data } : event
          )
        );
        // Forçar uma nova busca para garantir sincronia
        const updatedResponse = await fetch('http://localhost:5000/api/events');
        if (updatedResponse.ok) {
          const updatedData = await updatedResponse.json();
          setEvents(limit ? updatedData.slice(0, limit) : updatedData);
        }
        alert('Inscrição realizada com sucesso!');
      } else if (data.message === 'O usuário já está inscrito neste evento') {
        // Tratar o caso de erro 400 como sucesso implícito e forçar sincronia
        const updatedResponse = await fetch('http://localhost:5000/api/events');
        if (updatedResponse.ok) {
          const updatedData = await updatedResponse.json();
          setEvents(limit ? updatedData.slice(0, limit) : updatedData);
        }
        alert('Você já está inscrito neste evento!');
      } else {
        throw new Error(data.message || 'Erro ao realizar inscrição');
      }
    } catch (err) {
      console.error('Erro ao inscrever-se:', err);
      alert(`Erro ao inscrever-se: ${err.message}`);
    }
  };

  const handleUnregister = async (eventId) => {
    const event = events.find(event => event._id === eventId);
    if (!isUserRegistered(event)) {
      alert('Você não está inscrito no evento!');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/events/${eventId}/unregister`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token'),
        },
      });

      const data = await response.json();
      console.log('Dados retornados do backend (handleUnregister):', data);
      if (response.ok) {
        setEvents(prevEvents =>
          prevEvents.map(event =>
            event._id === eventId ? { ...event, ...data } : event
          )
        );
        // Forçar uma nova busca para garantir sincronia
        const updatedResponse = await fetch('http://localhost:5000/api/events');
        if (updatedResponse.ok) {
          const updatedData = await updatedResponse.json();
          setEvents(limit ? updatedData.slice(0, limit) : updatedData);
        }
        alert('Inscrição cancelada com sucesso!');
      } else {
        throw new Error(data.message || 'Erro ao cancelar inscrição');
      }
    } catch (err) {
      console.error('Erro ao cancelar inscrição:', err);
      alert(`Erro ao cancelar inscrição: ${err.message}`);
    }
  };

  const handleCommentSubmit = async (eventId) => {
    const comment = commentText[eventId];
    if (!comment || comment.trim() === '') {
      alert('Por favor, escreva um comentário válido.');
      return;
    }

    const event = events.find(event => event._id === eventId);
    const existingComment = event.comments?.find(
      comment => comment.user?._id === user?.id
    );
    if (existingComment) {
      alert('Você já comentou neste evento!');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/events/${eventId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token'),
        },
        body: JSON.stringify({ text: comment }),
      });
      const data = await response.json();
      if (response.ok) {
        setEvents(prevEvents =>
          prevEvents.map(event =>
            event._id === eventId ? { ...event, ...data } : event
          )
        );
        setCommentText({ ...commentText, [eventId]: '' });
      } else {
        throw new Error(data.message || 'Erro ao adicionar comentário');
      }
    } catch (err) {
      alert(`Erro ao adicionar comentário: ${err.message}`);
    }
  };

  const handleRatingSubmit = async (eventId) => {
    const score = ratingScore[eventId];
    if (!score || isNaN(score) || score < 1 || score > 5) {
      alert('Por favor, selecione uma nota válida entre 1 e 5.');
      return;
    }

    const event = events.find(event => event._id === eventId);
    const existingRating = event.ratings?.find(
      rating => rating.user?._id === user?.id
    );
    if (existingRating) {
      alert('Você já avaliou este evento!');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/events/${eventId}/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token'),
        },
        body: JSON.stringify({ score: Number(score) }),
      });
      const data = await response.json();
      if (response.ok) {
        setEvents(prevEvents =>
          prevEvents.map(event =>
            event._id === eventId ? { ...event, ...data } : event
          )
        );
        setRatingScore({ ...ratingScore, [eventId]: '' });
      } else {
        throw new Error(data.message || 'Erro ao adicionar avaliação');
      }
    } catch (err) {
      alert(`Erro ao adicionar avaliação: ${err.message}`);
    }
  };

  const isUserRegistered = (event) => {
    if (!user) return false;
    return event.participants?.some(
      participant => participant.user && participant.user._id === user._id
    );
  };

  const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const total = ratings.reduce((sum, rating) => sum + rating.score, 0);
    return (total / ratings.length).toFixed(1);
  };

  const renderStars = (averageRating) => {
    const stars = [];
    const fullStars = Math.floor(averageRating);
    const hasHalfStar = averageRating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<span key={i} className="star filled">★</span>);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<span key={i} className="star half-filled">★</span>);
      } else {
        stars.push(<span key={i} className="star">☆</span>);
      }
    }
    return stars;
  };

  return (
    <section className="event-list">
      <h2>EVENTOS DISPONÍVEIS</h2>
      <div className="events-container">
        {events.map((event, index) => {
          const avgRating = calculateAverageRating(event.ratings);
          const showAllComments = expandedComments[event._id];
          const userRating = event.ratings?.find(r => r.user?._id === user?.id)?.score;

          return (
            <motion.div
              key={event._id}
              className="event-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="banner-container">
                <img
                  src={event.image || banners[index % banners.length]}
                  alt={event.title}
                  className="event-banner"
                  onError={(e) => {
                    console.log(`Erro ao carregar imagem do evento ${event._id}: ${event.image}`);
                    e.target.src = banners[index % banners.length];
                  }}
                />
                <div className="banner-info">
                  <span className="event-category">{event.category}</span>
                  <span className="event-type">{event.eventType}</span>
                  {event.eventType === 'Pago' && (
                    <span className="event-price">R$ {event.price}</span>
                  )}
                </div>
              </div>

              <div className="event-content">
                <div className="event-info">
                  <h3>{event.title}</h3>
                  <div className="event-meta">
                    <p>
                      <strong>Data:</strong>{' '}
                      {new Date(event.date).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </p>
                    <p><strong>Local:</strong> {event.location}</p>
                    <p><strong>Descrição:</strong> {event.description}</p>
                  </div>

                  {isLoggedIn && user?.role === 'participant' && (
                    <>
                      <button
                        onClick={() => handleRegister(event._id)}
                        className="register-btn"
                      >
                        Inscrever-se
                      </button>
                      {isUserRegistered(event) && (
                        <button
                          onClick={() => handleUnregister(event._id)}
                          className="cancel-btn"
                          style={{ marginTop: '10px' }}
                        >
                          Cancelar Inscrição
                        </button>
                      )}
                    </>
                  )}
                  {(!isLoggedIn || user?.role === 'admin') && (
                    <button
                      onClick={() => navigate(`/events/${event._id}`)}
                      className="view-details"
                    >
                      Ver Detalhes
                    </button>
                  )}
                </div>
              </div>

              <div className="rating-comments-container">
                <div className="rating-section">
                  <div className="stars-container">
                    <div className="stars">
                      {renderStars(avgRating)}
                      <span className="average-rating">{avgRating}</span>
                    </div>
                    <span className="rating-count">Avaliações ({event.ratings?.length || 0})</span>
                  </div>

                  {isLoggedIn && user?.role === 'participant' && (
                    <div className="user-rating">
                      <select
                        value={ratingScore[event._id] || userRating || ''}
                        onChange={(e) =>
                          setRatingScore({ ...ratingScore, [event._id]: e.target.value })
                        }
                      >
                        <option value="">Sua nota</option>
                        {[1, 2, 3, 4, 5].map(num => (
                          <option key={num} value={num}>{num} ★</option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleRatingSubmit(event._id)}
                        disabled={!ratingScore[event._id] && !userRating}
                      >
                        {userRating ? 'Atualizar' : 'Avaliar'}
                      </button>
                    </div>
                  )}
                </div>

                {(isLoggedIn && (user?.role === 'participant' || user?.role === 'admin')) && (
                  <div className="comments-section">
                    <h4>Comentários ({event.comments?.length || 0})</h4>
                    <div className="comments-list">
                      {(showAllComments ? event.comments : event.comments?.slice(0, 2))?.map(
                        comment => (
                          <div key={comment._id} className="comment">
                            <p>
                              <strong>{comment.user?.name}:</strong> {comment.text}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                    {event.comments?.length > 2 && (
                      <button
                        className="show-more"
                        onClick={() => toggleComments(event._id)}
                      >
                        {showAllComments
                          ? 'Mostrar menos'
                          : `Ver mais (${event.comments.length - 2})`}
                      </button>
                    )}

                    {user?.role === 'participant' && (
                      <div className="add-comment">
                        <textarea
                          value={commentText[event._id] || ''}
                          onChange={(e) =>
                            setCommentText({ ...commentText, [event._id]: e.target.value })
                          }
                          placeholder="Adicione um comentário..."
                        />
                        <button
                          className="comment-button"
                          onClick={() => handleCommentSubmit(event._id)}
                          disabled={!commentText[event._id]}
                        >
                          Enviar Comentário
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

export default EventList;