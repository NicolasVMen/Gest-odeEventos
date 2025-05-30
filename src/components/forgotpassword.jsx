import { useState } from 'react';
import './ForgotPassword.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/users/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Um link para redefinir sua senha foi enviado para o seu e-mail.');
        setError('');
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
      setMessage('');
    }
  };

  return (
    <section className="forgot-password-container">
      <div className="forgot-password-box">
        <h2>Esqueci Minha Senha</h2>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
              required
            />
          </div>
          <button type="submit" className="forgot-password-button">Enviar</button>
        </form>
      </div>
    </section>
  );
}

export default ForgotPassword;