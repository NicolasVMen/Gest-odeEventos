import { useState } from 'react';
import { motion } from 'framer-motion';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para controle de envio

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Desativar o botão enquanto envia
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage('Mensagem enviada com sucesso! Entraremos em contato em breve.');
        setFormData({ name: '', email: '', message: '' }); // Limpar o formulário
      } else {
        throw new Error(data.message || 'Erro ao enviar a mensagem.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Erro ao enviar a mensagem. Tente novamente mais tarde.');
    } finally {
      setIsSubmitting(false); // Reativar o botão
    }
  };

  return (
    <motion.div
      className="contact-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="contact-container">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Entre em Contato
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Estamos aqui para ajudar! Entre em contato conosco para dúvidas, sugestões ou suporte.
        </motion.p>

        <div className="contact-content">
          <div className="contact-info">
            <h3>Informações de Contato</h3>
            <p>
              <strong>Email:</strong> <a href="mailto:contato@FNREventos.com">contato@FNREventos.com</a>
            </p>
            <p>
              <strong>Telefone:</strong> (11) 1234-5678
            </p>
            <p>
              <strong>Horário de Atendimento:</strong> Segunda a Sexta, das 9h às 18h
            </p>
          </div>

          <div className="contact-form">
            <h3>Envie uma Mensagem</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Nome</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Mensagem</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                ></textarea>
              </div>
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
              </button>
            </form>
            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Contact;