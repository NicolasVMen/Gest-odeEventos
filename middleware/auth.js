// auth.js
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    console.log('Nenhum token fornecido');
    return res.status(401).json({ message: 'Nenhum token, autorização negada' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decodificado:', decoded);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Erro ao verificar token:', err.message);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado. Faça login novamente.' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token inválido.' });
    }
    res.status(401).json({ message: 'Erro na autenticação.' });
  }
};

const admin = (req, res, next) => {
  console.log('req.user no middleware admin:', req.user);
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    console.log('Acesso negado - Usuário não é admin ou req.user não definido');
    res.status(403).json({ message: 'Acesso negado. Apenas administradores podem realizar esta ação.' });
  }
};

module.exports = { auth, admin };