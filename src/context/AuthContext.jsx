// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

// Criar o contexto
const AuthContext = createContext();

// Componente provedor do contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Verificando estado inicial do usuário...');
    const token = sessionStorage.getItem('token'); // Usar sessionStorage
    const storedUser = sessionStorage.getItem('user'); // Usar sessionStorage
    if (token && storedUser) {
      console.log('Usuário encontrado no sessionStorage:', storedUser);
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    } else {
      console.log('Nenhum usuário encontrado no sessionStorage.');
    }
    setLoading(false);
  }, []);

  const handleGoogleAuth = async (googleUser) => {
    try {
      console.log('Autenticando usuário com Google:', googleUser.email);
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: googleUser.email,
          googleId: googleUser.uid,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erro na resposta do backend:', errorData);
        throw new Error(errorData.message || 'Erro ao autenticar no backend');
      }

      const data = await response.json();
      console.log('Login com Google bem-sucedido:', data);
      sessionStorage.setItem('token', data.token); // Usar sessionStorage
      sessionStorage.setItem('user', JSON.stringify(data.user)); // Usar sessionStorage
      setUser(data.user);
      setIsLoggedIn(true);
      return true;
    } catch (err) {
      console.error('Erro ao autenticar com Google:', err.message);
      throw new Error(err.message);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('Iniciando login com e-mail e senha:', email);
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erro na resposta do backend:', errorData);
        throw new Error(errorData.message || 'Erro ao fazer login');
      }

      const data = await response.json();
      console.log('Login com e-mail e senha bem-sucedido:', data);
      sessionStorage.setItem('token', data.token); // Usar sessionStorage
      sessionStorage.setItem('user', JSON.stringify(data.user)); // Usar sessionStorage
      setUser(data.user);
      setIsLoggedIn(true);
      return true;
    } catch (err) {
      console.error('Erro ao fazer login com e-mail e senha:', err.message);
      throw new Error(err.message);
    }
  };

  const loginWithGoogle = async () => {
    try {
      console.log('Iniciando login com Google...');
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Resultado do pop-up obtido:', result);
      const user = result.user;
      await handleGoogleAuth(user);
    } catch (err) {
      console.error('Erro ao iniciar login com Google:', err.message);
      throw new Error(err.message);
    }
  };

  const logout = () => {
    console.log('Fazendo logout...');
    sessionStorage.removeItem('token'); // Usar sessionStorage
    sessionStorage.removeItem('user'); // Usar sessionStorage
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, loginWithGoogle, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Exportar o contexto
export { AuthContext };