import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Privacy.css';

function Privacy() {
  return (
    <motion.div
      className="privacy-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="privacy-container">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Política de Privacidade
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          No FNR Eventos, valorizamos sua privacidade e estamos comprometidos em proteger suas informações pessoais. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos seus dados ao utilizar nossa plataforma.
        </motion.p>

        <div className="privacy-section">
          <h3>1. Informações que Coletamos</h3>
          <p>
            Coletamos informações que você nos fornece diretamente, como:
          </p>
          <ul>
            <li>Dados de cadastro: nome, email, telefone e outras informações fornecidas ao criar uma conta.</li>
            <li>Informações de eventos: detalhes sobre eventos que você cria ou nos quais se inscreve.</li>
            <li>Dados de uso: informações sobre como você interage com a plataforma, como páginas visitadas e ações realizadas.</li>
            <li>Dados técnicos: endereço IP, tipo de dispositivo, navegador e sistema operacional.</li>
          </ul>
        </div>

        <div className="privacy-section">
          <h3>2. Como Usamos Suas Informações</h3>
          <p>
            Utilizamos seus dados para:
          </p>
          <ul>
            <li>Fornecer e melhorar nossos serviços, como gerenciar eventos e processar inscrições.</li>
            <li>Enviar comunicações, como confirmações de inscrição, lembretes de eventos e atualizações da plataforma.</li>
            <li>Personalizar sua experiência na plataforma.</li>
            <li>Garantir a segurança da plataforma, prevenindo fraudes e atividades não autorizadas.</li>
          </ul>
        </div>

        <div className="privacy-section">
          <h3>3. Compartilhamento de Dados</h3>
          <p>
            Não compartilhamos suas informações pessoais com terceiros, exceto:
          </p>
          <ul>
            <li>Com organizadores de eventos, para que possam gerenciar suas inscrições.</li>
            <li>Quando exigido por lei ou para proteger nossos direitos legais.</li>
            <li>Com prestadores de serviços que nos ajudam a operar a plataforma (ex.: provedores de email), sob acordos de confidencialidade.</li>
          </ul>
        </div>

        <div className="privacy-section">
          <h3>4. Armazenamento e Segurança</h3>
          <p>
            Seus dados são armazenados em servidores seguros e protegidos por medidas técnicas e organizacionais, como criptografia e controles de acesso. Mantemos seus dados apenas pelo tempo necessário para cumprir as finalidades descritas nesta política.
          </p>
        </div>

        <div className="privacy-section">
          <h3>5. Seus Direitos</h3>
          <p>
            Você tem o direito de:
          </p>
          <ul>
            <li>Acessar, corrigir ou excluir suas informações pessoais.</li>
            <li>Solicitar a portabilidade dos seus dados.</li>
            <li>Revogar o consentimento para o uso de seus dados, quando aplicável.</li>
            <li>Entrar em contato conosco para exercer esses direitos ou tirar dúvidas sobre esta política.</li>
          </ul>
        </div>

        <div className="privacy-section">
          <h3>6. Alterações nesta Política</h3>
          <p>
            Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre mudanças significativas por email ou através da plataforma.
          </p>
        </div>

        <div className="privacy-section">
          <h3>7. Contato</h3>
          <p>
            Para dúvidas sobre esta Política de Privacidade, entre em contato conosco pelo email{' '}
            <a href="mailto:contato@FNREventos.com">contato@FNREventos.com</a> ou pelo telefone (11) 1234-5678.
          </p>
          <p>
            Para mais informações sobre o uso da plataforma, consulte nossos <Link to="/terms">Termos de Uso</Link>.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default Privacy;