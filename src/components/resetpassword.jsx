import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // Importar framer-motion para animações
import './ResetPassword.css';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Senha redefinida com sucesso! Redirecionando para o login...');
        setError('');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
      setMessage('');
    }
  };

  return (
    <section className="reset-password-container">
      <motion.div
        className="reset-password-box"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2>Redefinir Senha</h2>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <motion.div className="input-group" whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <label htmlFor="password">Nova Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua nova senha"
              required
            />
          </motion.div>
          <motion.div className="input-group" whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <label htmlFor="confirm-password">Confirmar Senha</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme sua nova senha"
              required
            />
          </motion.div>
          <motion.button
            type="submit"
            className="reset-password-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            Redefinir
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
}

export default ResetPassword;