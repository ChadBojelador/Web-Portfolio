import { useEffect } from 'react';
import '../Styles/certificates.css';
import Navigation from '../Components/Navigation';
import CustomCursor from '../Components/CustomCursor';
import Experiences from '../Components/Experiences';
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

  return (
    <div className="cert-container">
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
          <article
            className="cert-card"
            key={`${cert.title}-${index}`}
            style={{ '--card-delay': `${index * 0.08}s` }}
          >
            <div className="cert-media">
              <img
                src={cert.image}
                alt={`${cert.title} certificate preview`}
                className="cert-image"
                loading="lazy"
              />
              <span className="cert-media-chip">{cert.issuer}</span>
            </div>

            <div className="cert-header">
              <h2>{cert.title}</h2>
              <div className="cert-date">Issued {cert.date}</div>
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
                View Certificate -&gt;
              </a>
              {cert.id && <span className="cert-id">ID: {cert.id}</span>}
            </div>
          </article>
        ))}
      </div>

      <Experiences />
    </div>
  );
};

export default Certificates;
