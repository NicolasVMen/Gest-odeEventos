import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/logo_site.ico'; // Ajuste o caminho conforme necessário
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isLoggedIn, logout } = useContext(AuthContext);
  const [profilePic, setProfilePic] = useState(null); // Estado para a foto do usuário

  // Carregar a foto de perfil do localStorage com base no ID do usuário
  useEffect(() => {
    if (isLoggedIn && user && user.id) {
      const savedProfilePic = localStorage.getItem(`profilePic_${user.id}`);
      if (savedProfilePic) {
        setProfilePic(savedProfilePic);
      } else {
        setProfilePic(null); // Limpar a foto se não houver uma salva para este usuário
      }
    } else {
      setProfilePic(null); // Limpar a foto se o usuário não estiver logado
    }
  }, [isLoggedIn, user]); // Dependências: isLoggedIn e user

  const scrollToEvents = (e) => {
    e.preventDefault();
    const eventsSection = document.getElementById('events');
    if (eventsSection) {
      eventsSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        const eventsSection = document.getElementById('events');
        if (eventsSection) {
          eventsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setProfilePic(null); // Limpar a foto ao fazer logout
    setMenuOpen(false);
    navigate('/'); // Redireciona para a página inicial após logout
  };

  const handleScroll = () => {
    if (window.scrollY > 50) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="logo">
        <img src={logo} alt="FNR Eventos Logo" className="logo-img" />
        <Link to="/">FNR Eventos</Link>
      </div>
      <nav className={menuOpen ? 'nav-open' : ''}>
        <ul>
          <li>
            <Link to="/" onClick={() => setMenuOpen(false)}>
              Início
            </Link>
          </li>
          <li>
            <Link to="/" onClick={scrollToEvents}>
              Eventos
            </Link>
          </li>
          {isLoggedIn ? (
            <>
              <li>
                <Link to="/profile" onClick={() => setMenuOpen(false)}>
                  Perfil
                </Link>
              </li>
              {user?.role === 'admin' && (
                <>
                  <li>
                    <Link to="/create-event" onClick={() => setMenuOpen(false)}>
                      Criar Evento
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin" onClick={() => setMenuOpen(false)}>
                      Dashboard
                    </Link>
                  </li>
                </>
              )}
              <li>
                <Link to="/" onClick={handleLogout}>
                  Sair
                </Link>
              </li>
              {profilePic && (
                <li className="profile-pic-item">
                  <img src={profilePic} alt="Foto do Usuário" className="header-profile-pic" />
                </li>
              )}
            </>
          ) : (
            <>
              <li>
                <Link to="/login" onClick={() => setMenuOpen(false)}>
                  Entrar
                </Link>
              </li>
              <li>
                <Link to="/register" onClick={() => setMenuOpen(false)}>
                  Cadastrar
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>
    </header>
  );
}

export default Header;