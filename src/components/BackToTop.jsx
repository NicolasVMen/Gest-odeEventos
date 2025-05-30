import { useState, useEffect } from 'react';
import { IoArrowUp } from 'react-icons/io5'; // Novo ícone do Ionicons
import './BackToTop.css';

function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div className="back-to-top">
      {isVisible && (
        <button onClick={scrollToTop} className="back-to-top-button" aria-label="Voltar ao topo">
          <IoArrowUp />
        </button>
      )}
    </div>
  );
}

export default BackToTop;