// users.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Event = require('../models/event');
const { auth, admin } = require('../middleware/auth');
const sendEmail = require('../utils/sendEmail');

// Middleware para processar JSON e URL-encoded
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Função para validar CPF
const validateCPF = (cpf) => {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11) return false;

  if (/^(\d)\1+$/.test(cpf)) return false;

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(10, 11))) return false;

  return true;
};

// Registrar um novo usuário
router.post('/register', async (req, res) => {
  const { name, email, password, confirmPassword, cpf, birthDate, googleId } = req.body;

  try {
    if (!googleId) {
      if (password !== confirmPassword) {
        return res.status(400).json({ message: 'As senhas não coincidem' });
      }

      if (!cpf || !validateCPF(cpf)) {
        return res.status(400).json({ message: 'CPF inválido' });
      }

      let userByCPF = await User.findOne({ cpf });
      if (userByCPF) {
        return res.status(400).json({ message: 'Este CPF já está registrado' });
      }

      const birth = new Date(birthDate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      if (age < 16) {
        return res.status(400).json({ message: 'Você deve ter pelo menos 16 anos para se cadastrar' });
      }
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }

    user = new User({
      name,
      email,
      password: googleId ? null : password,
      cpf: googleId ? null : cpf,
      birthDate: googleId ? null : birthDate,
      role: 'participant',
      googleId: googleId || null,
    });

    if (!googleId) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login de usuário
router.post('/login', async (req, res) => {
  const { email, password, googleId } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    if (googleId) {
      if (user.googleId !== googleId) {
        return res.status(400).json({ message: 'Credenciais inválidas' });
      }
    } else {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Credenciais inválidas' });
      }
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obter perfil do usuário autenticado
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Listar todos os usuários (somente administradores)
router.get('/', auth, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Deletar um usuário (somente administradores)
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(`Tentando deletar usuário com ID: ${userId}`);

    const user = await User.findById(userId);
    if (!user) {
      console.log(`Usuário com ID ${userId} não encontrado`);
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    console.log(`Usuário encontrado: ${user.name}`);

    console.log(`Removendo usuário ${userId} dos eventos (participantes, comentários, avaliações)`);
    await Event.updateMany(
      { 'participants.user': userId },
      { $pull: { participants: { user: userId } } }
    );
    await Event.updateMany(
      { 'comments.user': userId },
      { $pull: { comments: { user: userId } } }
    );
    await Event.updateMany(
      { 'ratings.user': userId },
      { $pull: { ratings: { user: userId } } }
    );

    console.log(`Deletando eventos criados pelo usuário ${userId}`);
    await Event.deleteMany({ createdBy: userId });

    console.log(`Deletando usuário ${userId}`);
    await User.findByIdAndDelete(userId);

    console.log(`Usuário ${userId} deletado com sucesso`);
    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar usuário:', err);
    res.status(500).json({ message: 'Erro ao deletar usuário: ' + err.message });
  }
});

// Esqueci a senha
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
    const emailContent = `
      <h2>Redefinição de Senha</h2>
      <p>Olá ${user.name},</p>
      <p>Você solicitou a redefinição de sua senha. Clique no link abaixo para redefinir sua senha:</p>
      <p><a href="${resetLink}">Redefinir Senha</a></p>
      <p>Se você não solicitou isso, ignore este email.</p>
      <p>Atenciosamente,<br>Equipe Gestão de Eventos</p>
    `;

    await sendEmail({
      to: user.email,
      subject: 'Redefinição de Senha - Gestão de Eventos',
      text: `Você solicitou a redefinição de sua senha. Acesse o link: ${resetLink}`,
      html: emailContent,
    });

    res.json({ message: 'Email de redefinição de senha enviado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Redefinir senha
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    res.json({ message: 'Senha redefinida com sucesso' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Inscrever-se para receber novidades (público)
router.post('/subscribe-newsletter', async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: 'E-mail é obrigatório' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.role === 'participant') {
      return res.status(400).json({ message: 'Este e-mail já está registrado' });
    }

    const emailContent = `
      <h2>Obrigado por se Inscrever!</h2>
      <p>Olá,</p>
      <p>Agradecemos por se inscrever para receber novidades do Gestão de Eventos!</p>
      <p>Em breve, você receberá atualizações sobre novos eventos e outras novidades.</p>
      <p>Atenciosamente,<br>Equipe Gestão de Eventos</p>
    `;

    await sendEmail({
      to: email,
      subject: 'Bem-vindo ao Gestão de Eventos!',
      text: 'Obrigado por se inscrever! Em breve, você receberá novidades sobre nossos eventos.',
      html: emailContent,
    });

    res.status(200).json({ message: 'Inscrição realizada com sucesso! Verifique seu e-mail.' });
  } catch (err) {
    console.error('Erro ao enviar e-mail de agradecimento:', err);
    res.status(500).json({ message: 'Erro ao enviar e-mail de agradecimento: ' + err.message });
  }
});

module.exports = router;