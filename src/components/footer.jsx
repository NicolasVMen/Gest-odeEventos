import { Link } from 'react-router-dom';
import { useState } from 'react';
import logo from '../assets/logo_site.ico'; // Ajuste o caminho conforme necessário
import './Footer.css';

function Footer() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/users/subscribe-newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Obrigado por se inscrever! Você receberá novidades em breve.');
        setError(null);
        setEmail('');
      } else {
        throw new Error(data.message || 'Erro ao se inscrever para novidades');
      }
    } catch (err) {
      setError(err.message);
      setMessage(null);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section newsletter">
          <h3>Receba Novidades</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
              required
            />
            <button type="submit">Inscrever-se</button>
          </form>
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
        </div>
        <div className="footer-section">
          <div className="footer-logo">
            <img src={logo} alt="FNR Eventos Logo" className="footer-logo-img" />
            <p>© 2025 FNR Eventos. Todos os direitos reservados.</p>
          </div>
          <div className="footer-links">
            <Link to="/about">Sobre</Link>
            <Link to="/contact">Contato</Link>
            <Link to="/terms">Termos</Link>
          </div>
          <p>Criado por Fabiano, Nicolas e Rafael</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;