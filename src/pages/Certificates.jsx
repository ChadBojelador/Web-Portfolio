import React, { useEffect, useState, useCallback, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion, useInView } from 'framer-motion';
import '../Styles/certificates.css';
import Navigation from '../Components/Navigation';
import CustomCursor from '../Components/CustomCursor';
import Experiences from '../Components/Experiences';
import CertificatePanel from '../Components/CertificatePanel';
import { certificates } from '../data/certificates';

const Certificates = () => {
  const techStackGroups = [
    { title: 'Frontend', items: ['React', 'JavaScript', 'Tailwind CSS', 'Framer Motion'] },
    { title: 'Backend', items: ['Node.js', 'Express.js', 'REST APIs', 'MySQL'] },
    { title: 'Languages', items: ['Java', 'Python', 'C++'] },
    { title: 'AI & Tooling', items: ['Google ADK', 'Claude CLI', 'Cursor', 'OpenClaw', 'Antigravity'] },
    { title: 'Workflow', items: ['Git', 'GitHub', 'System Design', 'Automation Thinking'] },
  ];

  const skillsRef = useRef(null);
  const skillsInView = useInView(skillsRef, { once: true, margin: '-120px' });

  const skillsContainerVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        when: 'beforeChildren',
        staggerChildren: 0.12,
      },
    },
  };

  const skillsItemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.985 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  };

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
        <motion.section
          ref={skillsRef}
          className="cert-skills-section"
          aria-label="Skills"
          variants={skillsContainerVariants}
          initial="hidden"
          animate={skillsInView ? 'visible' : 'hidden'}
        >
          <motion.div className="cert-skills-header" variants={skillsItemVariants}>
            <p className="cert-skills-eyebrow">Skills</p>
            <h2 className="cert-skills-title">Architecture-led execution with AI at the core</h2>
            <p className="cert-skills-intro">
              I build fast, think in systems, and use AI as a core part of how I create.
            </p>
          </motion.div>

          <div className="cert-skills-grid">
            <motion.article className="cert-skill-card" variants={skillsItemVariants}>
              <h3 className="cert-skill-card-title">Agentic AI &amp; Tools</h3>
              <p className="cert-skill-card-text">
                Design and use AI agent workflows for real output, not just prompts.
              </p>
              <p className="cert-skill-card-text">
                Tools: Google ADK, OpenClaw, Claude CLI, Cursor, Antigravity.
              </p>
              <p className="cert-skill-card-text">Multi-model and tool integration mindset.</p>
            </motion.article>

            <motion.article className="cert-skill-card" variants={skillsItemVariants}>
              <h3 className="cert-skill-card-title">Architecture &amp; Systems Thinking</h3>
              <p className="cert-skill-card-text">Architecture-first before coding.</p>
              <p className="cert-skill-card-text">
                Build scalable, modular, and automated workflows.
              </p>
              <p className="cert-skill-card-text">Turn ideas into structured systems.</p>
            </motion.article>

            <motion.article className="cert-skill-card" variants={skillsItemVariants}>
              <h3 className="cert-skill-card-title">Full-Stack Development</h3>
              <p className="cert-skill-card-text">
                Strong foundation in React for frontend and Node.js for backend.
              </p>
              <p className="cert-skill-card-text">
                Build and integrate APIs, databases, and UI systems.
              </p>
            </motion.article>

            <motion.article className="cert-skill-card" variants={skillsItemVariants}>
              <h3 className="cert-skill-card-title">AI-Augmented Workflow</h3>
              <p className="cert-skill-card-text">Use AI to code, debug, and accelerate development.</p>
              <p className="cert-skill-card-text">
                Focus on speed, efficiency, and output scaling.
              </p>
            </motion.article>
          </div>

          <motion.aside className="cert-skills-edge" aria-label="My edge" variants={skillsItemVariants}>
            <h3 className="cert-skills-edge-title">My Edge</h3>
            <p className="cert-skills-edge-text">
              I do not just build apps. I design systems where AI does the work.
            </p>
          </motion.aside>

          <motion.section className="cert-techstack-section" aria-label="Tech Stack" variants={skillsItemVariants}>
            <div className="cert-techstack-header">
              <p className="cert-techstack-eyebrow">Tech Stack</p>
              <h3 className="cert-techstack-title">Technology stack I use across design and development</h3>
            </div>

            <div className="cert-techstack-groups">
              {techStackGroups.map((group) => (
                <article key={group.title} className="cert-techstack-group">
                  <h4 className="cert-techstack-group-title">{group.title}</h4>
                  <div className="cert-techstack-chips">
                    {group.items.map((item) => (
                      <span key={item} className="cert-techstack-chip">{item}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </motion.section>
        </motion.section>

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
