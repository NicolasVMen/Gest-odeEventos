// index.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const userRoutes = require('./routes/users');
const eventRoutes = require('./routes/events');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use('/uploads', express.static('uploads'));

// Rotas
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);

// Conectar ao MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 30000,
    connectTimeoutMS: 30000,
  })
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));