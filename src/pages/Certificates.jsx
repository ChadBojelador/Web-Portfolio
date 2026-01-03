import { useEffect } from 'react';
import '../Styles/certificates.css';
import Navigation from '../Components/Navigation';
import CustomCursor from '../Components/CustomCursor';
import Experiences from '../Components/Experiences';
import { certificates } from '../data/certificates';
import { useScrollNavigation } from '../hooks/useScrollNavigation';

const Certificates = () => {
  useScrollNavigation();
  
  useEffect(() => {
    // Certificate card animation on scroll
    const certCards = document.querySelectorAll('.cert-card');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = 1;
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });
    
    certCards.forEach(card => {
      card.style.opacity = 0;
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(card);
    });
    
    return () => {
      certCards.forEach(card => observer.unobserve(card));
    };
  }, []);

  return (
    <div className="cert-container">
      {/* Floating decorative elements */}
      <div className="floating">{'{ }'}</div>
      <div className="floating">;</div>
      <div className="floating">( )</div>
      <div className="floating">[ ]</div>
      <CustomCursor />
      <section className="hero">
        <Navigation />
        <h1>My Certificates</h1>
        <p>Professional certifications and achievements demonstrating expertise across various technologies</p>
      </section>
      
      <div className="cert-grid">
        {certificates.map((cert, index) => (
          <div className="cert-card" key={index}>
            <div className="cert-header">
              <h2>{cert.title}</h2>
              <div className="cert-issuer">{cert.issuer}</div>
              <div className="cert-date">Issued: {cert.date}</div>
            </div>
            <div className="cert-body">
              <p className="cert-desc">{cert.description}</p>
              <div className="cert-tags">
                {cert.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className={`cert-tag box-${(tagIndex % 11) + 1}`}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="cert-footer">
              <a target="_blank" rel="noopener noreferrer" href={cert.link} className="cert-link">
                View Certificate ↗
              </a>
              {cert.id && <span className="cert-id">ID: {cert.id}</span>}
            </div>
          </div>
        ))}
      </div>
      <Experiences />
    </div>
  );
};

export default Certificates;