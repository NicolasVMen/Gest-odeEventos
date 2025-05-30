import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaTicketAlt, FaUsers, FaStar, FaChartLine, FaUserFriends, FaUserTie } from 'react-icons/fa';
import EventList from './eventlist';
import bannerSite from '../assets/banner-site.jpg'; // Mantendo o banner que você importou
import './Home.css';

function Home() {
  const navigate = useNavigate();

  const scrollToEvents = () => {
    const eventsSection = document.getElementById('events');
    if (eventsSection) {
      eventsSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        const eventsSection = document.getElementById('events');
        if (eventsSection) {
          eventsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const testimonials = [
    {
      name: 'Ana Silva',
      role: 'Organizadora de Eventos',
      text: 'O FNR Eventos transformou a forma como organizo meus eventos. Tudo é tão simples e eficiente!',
      rating: 5,
    },
    {
      name: 'João Pereira',
      role: 'Participante',
      text: 'Encontrei eventos incríveis e me inscrevi com facilidade. Recomendo a todos!',
      rating: 4,
    },
    {
      name: 'Mariana Costa',
      role: 'Organizadora',
      text: 'A plataforma é intuitiva e me ajudou a atrair mais participantes para meus eventos.',
      rating: 5,
    },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <motion.section
        className="hero-section"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bannerSite})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }} // Animação mais suave
      >
        <div className="hero-content">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
          >
            Crie e Participe de Eventos Memoráveis
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
          >
            O FNR Eventos conecta organizadores e participantes em experiências únicas. Comece agora!
          </motion.p>
          <motion.div
            className="hero-cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6, ease: 'easeOut' }}
          >
            <button onClick={() => navigate('/register')} className="cta-button primary">
              Cadastre-se Agora
            </button>
            <button onClick={scrollToEvents} className="cta-button secondary">
              Explore Eventos
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* Benefícios Section */}
      <section className="benefits-section">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          Por que Escolher o FNR Eventos?
        </motion.h2>
        <div className="benefits-list">
          <motion.div
            className="benefit-item"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
          >
            <FaCalendarAlt className="benefit-icon" />
            <h3>Gestão Simplificada</h3>
            <p>Crie e gerencie eventos com facilidade, tudo em um só lugar.</p>
          </motion.div>
          <motion.div
            className="benefit-item"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5, ease: 'easeOut' }}
          >
            <FaTicketAlt className="benefit-icon" />
            <h3>Inscrições Fáceis</h3>
            <p>Participe de eventos com poucos cliques, de forma segura e rápida.</p>
          </motion.div>
          <motion.div
            className="benefit-item"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.5, ease: 'easeOut' }}
          >
            <FaUsers className="benefit-icon" />
            <h3>Conexões Memoráveis</h3>
            <p>Conecte-se com pessoas e viva experiências inesquecíveis.</p>
          </motion.div>
        </div>
      </section>

      {/* Estatísticas Section */}
      <section className="stats-section">
        <motion.div
          className="stats-container"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="stat-item">
            <FaChartLine className="stat-icon" />
            <h3>1.000+</h3>
            <p>Eventos Criados</p>
          </div>
          <div className="stat-item">
            <FaUserFriends className="stat-icon" />
            <h3>50.000+</h3>
            <p>Participantes</p>
          </div>
          <div className="stat-item">
            <FaUserTie className="stat-icon" />
            <h3>500+</h3>
            <p>Organizadores Ativos</p>
          </div>
        </motion.div>
      </section>

      {/* Eventos em Destaque */}
      <section id="events" className="events-section">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          Eventos em Destaque
        </motion.h2>
        <EventList scrollToEvents={scrollToEvents} limit={3} />
        <motion.button
          onClick={() => navigate('/events')}
          className="see-more-button"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5, ease: 'easeOut' }}
        >
          Ver Mais Eventos
        </motion.button>
      </section>

      {/* Depoimentos Section */}
      <section className="testimonials-section">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          O que Nossos Usuários Dizem
        </motion.h2>
        <div className="testimonials-list">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="testimonial-item"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5, ease: 'easeOut' }}
            >
              <div className="testimonial-rating">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} className="star" />
                ))}
              </div>
              <p className="testimonial-text">"{testimonial.text}"</p>
              <p className="testimonial-author">
                <strong>{testimonial.name}</strong>, {testimonial.role}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <section className="cta-section">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          Pronto para Transformar Seus Eventos?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
        >
          Junte-se ao FNR Eventos e comece a criar experiências inesquecíveis hoje mesmo.
        </motion.p>
        <motion.button
          onClick={() => navigate('/register')}
          className="cta-button primary"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5, ease: 'easeOut' }}
        >
          Comece Agora
        </motion.button>
      </section>
    </div>
  );
}

export default Home;