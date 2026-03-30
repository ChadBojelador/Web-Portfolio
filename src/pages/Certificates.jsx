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

      <section className="cert-intro-layout" aria-label="Skills and Professional Journey">
        <section className="cert-skills-section" aria-label="Skills">
          <div className="cert-skills-header">
            <p className="cert-skills-eyebrow">Skills</p>
            <h2 className="cert-skills-title">Architecture-led execution with AI at the core</h2>
            <p className="cert-skills-intro">
              I build fast, think in systems, and use AI as a core part of how I create.
            </p>
          </div>

          <div className="cert-skills-grid">
            <article className="cert-skill-card">
              <h3 className="cert-skill-card-title">Agentic AI &amp; Tools</h3>
              <p className="cert-skill-card-text">
                Design and use AI agent workflows for real output, not just prompts.
              </p>
              <p className="cert-skill-card-text">
                Tools: Google ADK, OpenClaw, Claude CLI, Cursor, Antigravity.
              </p>
              <p className="cert-skill-card-text">Multi-model and tool integration mindset.</p>
            </article>

            <article className="cert-skill-card">
              <h3 className="cert-skill-card-title">Architecture &amp; Systems Thinking</h3>
              <p className="cert-skill-card-text">Architecture-first before coding.</p>
              <p className="cert-skill-card-text">
                Build scalable, modular, and automated workflows.
              </p>
              <p className="cert-skill-card-text">Turn ideas into structured systems.</p>
            </article>

            <article className="cert-skill-card">
              <h3 className="cert-skill-card-title">Full-Stack Development</h3>
              <p className="cert-skill-card-text">
                Strong foundation in React for frontend and Node.js for backend.
              </p>
              <p className="cert-skill-card-text">
                Build and integrate APIs, databases, and UI systems.
              </p>
            </article>

            <article className="cert-skill-card">
              <h3 className="cert-skill-card-title">AI-Augmented Workflow</h3>
              <p className="cert-skill-card-text">Use AI to code, debug, and accelerate development.</p>
              <p className="cert-skill-card-text">
                Focus on speed, efficiency, and output scaling.
              </p>
            </article>
          </div>

          <aside className="cert-skills-edge" aria-label="My edge">
            <h3 className="cert-skills-edge-title">My Edge</h3>
            <p className="cert-skills-edge-text">
              I do not just build apps. I design systems where AI does the work.
            </p>
          </aside>
        </section>

        <Experiences className="cert-experience-panel" />
      </section>

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

      <div className="w-full max-w-325 mx-auto overflow-hidden py-4 cursor-grab active:cursor-grabbing pb-8">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4 sm:gap-6">
            {certificates.map((cert, index) => (
              <div 
                key={`${cert.title}-${index}`} 
                className={`transition-all duration-500 min-w-0 flex-[0_0_88%] sm:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.3333%-16px)] ${selectedIndex === index ? "scale-100 opacity-100" : "scale-[0.96] opacity-60"}`}
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
