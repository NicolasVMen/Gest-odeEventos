import { motion } from 'framer-motion';
import './About.css';

function About() {
  return (
    <motion.div
      className="about-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="about-container">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Sobre o FNR Eventos
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          O FNR Eventos é uma plataforma inovadora dedicada à gestão de eventos, conectando organizadores e participantes em experiências inesquecíveis. Nossa missão é simplificar a criação e o gerenciamento de eventos, permitindo que organizadores de todos os tipos – desde pequenos encontros até grandes conferências – alcancem seu público de forma eficiente.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Para os participantes, oferecemos uma maneira fácil e segura de descobrir eventos de seu interesse, inscrever-se e participar de momentos únicos. Acreditamos que eventos têm o poder de unir pessoas, inspirar mudanças e criar memórias duradouras.
        </motion.p>

        <div className="about-values">
          <h3>Nossos Valores</h3>
          <div className="values-list">
            <div className="value-item">
              <h4>Inovação</h4>
              <p>Buscamos constantemente novas formas de melhorar a experiência de eventos para todos.</p>
            </div>
            <div className="value-item">
              <h4>Conexão</h4>
              <p>Fomentamos laços entre pessoas através de experiências compartilhadas.</p>
            </div>
            <div className="value-item">
              <h4>Confiabilidade</h4>
              <p>Oferecemos uma plataforma segura e confiável para organizadores e participantes.</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default About;