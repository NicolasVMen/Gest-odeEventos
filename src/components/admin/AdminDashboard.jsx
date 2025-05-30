// AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminDashboard.css';

function AdminDashboard() {
  const { user, logout } = useAuth(); // Adicionei logout do contexto
  const navigate = useNavigate();
  const location = useLocation();
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        const token = sessionStorage.getItem('token'); // Alterado para sessionStorage
        if (!token) {
          throw new Error('Token não encontrado. Por favor, faça login novamente.');
        }

        // Buscar eventos
        const eventsResponse = await fetch('http://localhost:5000/api/events', {
          headers: {
            'x-auth-token': token,
          },
        });
        const eventsData = await eventsResponse.json();
        if (eventsResponse.ok) {
          setEvents(eventsData);
        } else {
          throw new Error(eventsData.message || 'Erro ao buscar eventos');
        }

        // Buscar usuários
        const usersResponse = await fetch('http://localhost:5000/api/users', {
          headers: {
            'x-auth-token': token,
          },
        });
        const usersData = await usersResponse.json();
        if (usersResponse.ok) {
          setUsers(usersData);
        } else {
          throw new Error(usersData.message || 'Erro ao buscar usuários');
        }
      } catch (err) {
        if (err.message.includes('Token') || err.message.includes('autorização negada')) {
          logout(); // Limpar sessionStorage e deslogar
          navigate('/login', { state: { message: 'Sessão expirada. Por favor, faça login novamente.' } });
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate, location.state?.refresh, logout]);

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Tem certeza que deseja deletar este evento?')) return;

    try {
      const token = sessionStorage.getItem('token'); // Alterado para sessionStorage
      if (!token) {
        throw new Error('Token não encontrado. Por favor, faça login novamente.');
      }

      const response = await fetch(`http://localhost:5000/api/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token,
        },
      });

      if (response.ok) {
        setEvents(events.filter(event => event._id !== eventId));
        alert('Evento deletado com sucesso!');
      } else {
        const data = await response.json();
        throw new Error(data.message);
      }
    } catch (err) {
      if (err.message.includes('Token') || err.message.includes('autorização negada')) {
        logout();
        navigate('/login', { state: { message: 'Sessão expirada. Por favor, faça login novamente.' } });
      } else {
        alert(`Erro ao deletar evento: ${err.message}`);
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Tem certeza que deseja deletar este usuário?')) return;

    try {
      const token = sessionStorage.getItem('token'); // Alterado para sessionStorage
      if (!token) {
        throw new Error('Token não encontrado. Por favor, faça login novamente.');
      }

      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token,
        },
      });

      if (response.ok) {
        setUsers(users.filter(user => user._id !== userId));
        alert('Usuário deletado com sucesso!');
      } else {
        const data = await response.json();
        throw new Error(data.message);
      }
    } catch (err) {
      if (err.message.includes('Token') || err.message.includes('autorização negada')) {
        logout();
        navigate('/login', { state: { message: 'Sessão expirada. Por favor, faça login novamente.' } });
      } else {
        alert(`Erro ao deletar usuário: ${err.message}`);
      }
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return (
    <div>
      <p>Erro: {error}</p>
      <button onClick={() => window.location.reload()} style={{ padding: '5px 10px' }}>
        Tentar Novamente
      </button>
    </div>
  );

  return (
    <section className="admin-dashboard">
      <h2>Dashboard do Administrador</h2>

      <div className="dashboard-section">
        <h3>Eventos</h3>
        <button onClick={() => navigate('/create-event')} className="create-event-btn">
          Criar Novo Evento
        </button>
        {events.length === 0 ? (
          <p>Nenhum evento encontrado.</p>
        ) : (
          <table className="events-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Data</th>
                <th>Local</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event._id}>
                  <td>{event.title}</td>
                  <td>{event.date}</td>
                  <td>{event.location}</td>
                  <td>
                    <button onClick={() => handleDeleteEvent(event._id)} className="delete-btn">
                      Deletar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="dashboard-section">
        <h3>Usuários</h3>
        {users.length === 0 ? (
          <p>Nenhum usuário encontrado.</p>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Função</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button onClick={() => handleDeleteUser(user._id)} className="delete-btn">
                      Deletar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

export default AdminDashboard;