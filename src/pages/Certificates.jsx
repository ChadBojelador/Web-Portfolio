import React, { useEffect, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
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

  }, []);

  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: false, 
    align: 'start', 
    containScroll: 'trimSnaps' 
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback((index) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  return (
    <div className="cert-container">
      <div className="floating">;</div>
      <div className="floating">( )</div>
      <div className="floating">[ ]</div>
      <div className="nav">
        <Navigation />
        <CustomCursor />
      </div>

      <Experiences />

      <div className="exp-cert-divider">
        <div className="exp-cert-divider-dot"></div>
      </div>

      <section className="cert-toolbar" aria-label="Certificate Showcase">
        <h1 className="cert-title">My Certificates</h1>
        <div className="cert-meta">
          <span className="cert-count">
            {String(certificates.length).padStart(2, '0')} certificates
          </span>
        </div>
      </section>

      <div className="w-full max-w-[1300px] mx-auto overflow-hidden py-4 cursor-grab active:cursor-grabbing pb-8">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4 sm:gap-6">
            {certificates.map((cert, index) => (
              <div 
                key={`${cert.title}-${index}`} 
                className={`transition-all duration-500 min-w-0 flex-[0_0_88%] sm:flex-[0_0_calc(50%_-_12px)] lg:flex-[0_0_calc(33.3333%_-_16px)] ${selectedIndex === index ? "scale-100 opacity-100" : "scale-[0.96] opacity-60"}`}
              >
                <CertificatePanel cert={cert} index={index} />
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Indicators like Home Page */}
        <div className="flex justify-center mt-10 gap-2 sm:gap-3">
          {certificates.map((_, idx) => (
            <button
              key={idx}
              className={`w-2 h-2 rounded-full transition-all duration-500 ${
                selectedIndex === idx 
                  ? "bg-white w-8" 
                  : "bg-white/20 hover:bg-white/40"
              }`}
              onClick={() => scrollTo(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Certificates;
