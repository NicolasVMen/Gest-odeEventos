// src/components/Register.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import './Register.css';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [cpf, setCpf] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Iniciando cadastro manual...');
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, confirmPassword, cpf, birthDate, isAdmin: false }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erro na resposta do backend:', errorData);
        throw new Error(errorData.message || 'Erro ao cadastrar');
      }

      const data = await response.json();
      console.log('Cadastro manual bem-sucedido:', data);
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      console.log('Iniciando cadastro com Google...');
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Resultado do pop-up obtido:', result);
      const user = result.user;
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          googleId: user.uid,
          isAdmin: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erro na resposta do backend:', errorData);
        throw new Error(errorData.message || 'Erro ao cadastrar com Google');
      }

      const data = await response.json();
      console.log('Cadastro com Google bem-sucedido:', data);
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const formatCPF = (value) => {
    value = value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return value;
  };

  const handleCpfChange = (e) => {
    const formattedCpf = formatCPF(e.target.value);
    setCpf(formattedCpf);
  };

  return (
    <section className="register-container">
      <motion.div
        className="register-box"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2>Criar Conta</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <motion.div className="input-group" whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <label htmlFor="name">Nome Completo</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome completo"
              required
              autoComplete="name"
            />
          </motion.div>
          <motion.div className="input-group" whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
              required
              autoComplete="email"
            />
          </motion.div>
          <motion.div className="input-group" whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <label htmlFor="cpf">CPF</label>
            <input
              type="text"
              id="cpf"
              name="cpf"
              value={cpf}
              onChange={handleCpfChange}
              placeholder="Digite seu CPF"
              maxLength="14"
              required
              autoComplete="off"
            />
          </motion.div>
          <motion.div className="input-group" whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <label htmlFor="birthDate">Data de Nascimento</label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
              autoComplete="bday"
            />
          </motion.div>
          <motion.div className="input-group" whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <label htmlFor="password">Senha</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={toggleShowPassword}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </motion.div>
          <motion.div className="input-group" whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <label htmlFor="confirmPassword">Confirmar Senha</label>
            <div className="password-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme sua senha"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={toggleShowConfirmPassword}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </motion.div>
          <motion.button
            type="submit"
            className="register-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            Cadastrar
          </motion.button>
        </form>
        <motion.button
          className="google-register-button"
          onClick={handleGoogleRegister}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <FaGoogle style={{ marginRight: '8px' }} />
          Cadastrar com Google
        </motion.button>
        <p className="login-link">
          Já tem uma conta? <Link to="/login">Entre aqui</Link>
        </p>
      </motion.div>
    </section>
  );
}

export default Register;