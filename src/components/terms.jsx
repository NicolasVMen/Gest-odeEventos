import { motion } from 'framer-motion';
import './Terms.css';

function Terms() {
  return (
    <motion.div
      className="terms-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="terms-container">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Termos de Uso
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Ao utilizar o FNR Eventos, você concorda com os seguintes termos e condições, que regem o uso da nossa plataforma. Leia atentamente antes de utilizar nossos serviços.
        </motion.p>

        <div className="terms-section">
          <h3>1. Condições Gerais</h3>
          <ul>
            <li>Não utilize a plataforma para fins ilegais ou não autorizados.</li>
            <li>Respeite os outros usuários, organizadores e a equipe do FNR Eventos.</li>
            <li>Mantenha suas informações de login (email e senha) seguras e não as compartilhe com terceiros.</li>
          </ul>
        </div>

        <div className="terms-section">
          <h3>2. Responsabilidades do Usuário</h3>
          <ul>
            <li>Você é responsável por todas as atividades realizadas em sua conta.</li>
            <li>Garanta que as informações fornecidas (como dados de eventos ou informações pessoais) sejam precisas e verdadeiras.</li>
            <li>Não publique conteúdo ofensivo, difamatório ou que viole os direitos de terceiros.</li>
          </ul>
        </div>

        <div className="terms-section">
          <h3>3. Política de Privacidade</h3>
          <p>
            Respeitamos sua privacidade. Para saber como tratamos seus dados, consulte nossa <a href="/privacy">Política de Privacidade</a>.
          </p>
        </div>

        <div className="terms-section">
          <h3>4. Contato</h3>
          <p>
            Para mais detalhes ou dúvidas sobre os Termos de Uso, entre em contato conosco pelo email{' '}
            <a href="mailto:contato@FNREventos.com">contato@FNREventos.com</a>.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default Terms;