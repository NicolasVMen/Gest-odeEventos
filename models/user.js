const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Nome completo
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Não será necessário para usuários que se cadastram com Google
  cpf: { type: String, unique: true, sparse: true }, // sparse permite que o campo seja opcional (para login com Google)
  birthDate: { type: Date }, // Data de nascimento
  role: { type: String, enum: ['admin', 'participant'], default: 'participant' },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  googleId: { type: String, unique: true, sparse: true }, // Para usuários que se cadastram com Google
});

module.exports = mongoose.model('User', userSchema);