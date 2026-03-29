import { useEffect, useRef } from 'react';
import '../Styles/certificates.css';
import Navigation from '../Components/Navigation';
import CustomCursor from '../Components/CustomCursor';
import Experiences from '../Components/Experiences';
import CertificatePanel from '../Components/CertificatePanel';
import { certificates } from '../data/certificates';

const Certificates = () => {
  useEffect(() => {
    const certCards = document.querySelectorAll('.cert-card');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    certCards.forEach(card => {
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  const carouselRef = useRef(null);

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -460 : 460;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="cert-container">
      <div className="floating">;</div>
      <div className="floating">( )</div>
      <div className="floating">[ ]</div>
      <div className="nav">
        <Navigation />
        <CustomCursor />
      </div>

      <section className="cert-toolbar" aria-label="Certificate Showcase">
        <h1 className="cert-title">My Certificates</h1>
        <div className="cert-meta">
          <span className="cert-count">
            {String(certificates.length).padStart(2, '0')} certificates
          </span>
        </div>
      </section>

      <div className="cert-carousel-wrapper">
        <button 
          className="carousel-btn carousel-prev" 
          onClick={() => scroll('left')} 
          aria-label="Scroll left"
        >
          &#8249;
        </button>

        <div className="cert-grid-showcase" ref={carouselRef}>
          {certificates.map((cert, index) => (
            <CertificatePanel key={`${cert.title}-${index}`} cert={cert} index={index} />
          ))}
        </div>

        <button 
          className="carousel-btn carousel-next" 
          onClick={() => scroll('right')} 
          aria-label="Scroll right"
        >
          &#8250;
        </button>
      </div>

      <Experiences />
    </div>
  );
};

export default Certificates;
