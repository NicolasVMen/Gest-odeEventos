import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import './Profile.css';

function Profile() {
  const { isLoggedIn, user, loading } = useAuth(); // Adicionar loading
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState(null);

  // Carregar a foto de perfil do localStorage ao montar o componente
  useEffect(() => {
    if (user && user.id) {
      const savedProfilePic = localStorage.getItem(`profilePic_${user.id}`);
      if (savedProfilePic) {
        setProfilePic(savedProfilePic);
      }
    }
  }, [user]);

  useEffect(() => {
    console.log('isLoggedIn:', isLoggedIn, 'loading:', loading);
    if (!loading && !isLoggedIn) { // Só redirecionar se o carregamento terminou e o usuário não está logado
      navigate('/login');
    }
  }, [isLoggedIn, loading, navigate]); // Adicionar loading como dependência

  // Função para lidar com o upload da foto
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setProfilePic(base64String);
        if (user && user.id) {
          localStorage.setItem(`profilePic_${user.id}`, base64String); // Salvar com chave única
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Função para deletar a foto de perfil
  const handleDeleteProfilePic = () => {
    setProfilePic(null);
    if (user && user.id) {
      localStorage.removeItem(`profilePic_${user.id}`); // Remover com chave única
    }
  };

  if (loading) {
    return <div>Carregando...</div>; // Exibir mensagem de carregamento enquanto verifica autenticação
  }

  if (!isLoggedIn) return null;

  return (
    <motion.div
      className="profile-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="profile-content">
        <div className="profile-pic-section">
          {profilePic ? (
            <img src={profilePic} alt="Foto de Perfil" className="profile-pic" />
          ) : (
            <div className="profile-pic-placeholder">
              <span>Adicione uma foto</span>
            </div>
          )}
          <div className="profile-pic-actions">
            <label htmlFor="profile-pic-upload" className="profile-pic-label">
              Alterar Foto
            </label>
            {profilePic && (
              <button className="delete-pic-btn" onClick={handleDeleteProfilePic}>
                Deletar Foto
              </button>
            )}
            <input
              id="profile-pic-upload"
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              style={{ display: 'none' }}
            />
          </div>
        </div>
        <div className="profile-info-section">
          <h2>Meu Perfil</h2>
          {user && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Bem-vindo, {user.name}!
            </motion.p>
          )}
          <p>E-mail: {user?.email || 'Não disponível'}</p>
          <p>Papel: {user?.role || 'Não disponível'}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default Profile;