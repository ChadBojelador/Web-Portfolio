// pages/App.jsx
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { Draggable } from 'gsap/Draggable';
import { animate, inView, stagger } from "https://cdn.jsdelivr.net/npm/motion@12.15.0/+esm";
import emailjs from 'emailjs-com';
import picture from '../assets/picture.svg';
import CustomCursor from '../Components/CustomCursor';
import Navigation from '../Components/Navigation';
import Signages from '../Components/Signages';
import ProjectPanel from '../Components/ProjectPanel';
import Experiences from '../Components/Experiences';
import { projects } from '../data/projects';
import { certificates } from '../data/certificates';
import { tools } from '../data/tools';
import '../Styles/index.css';
import '../Styles/Projects.css';
import '../Styles/ProjectCarousel.css';
import '../Styles/certificates.css';
import '../Styles/tools.css';
import '../Styles/contact.css';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, Draggable);
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

function App() {
  const colorIndex = useRef(0);
  const timeoutRef = useRef(null);
  const seamlessLoopRef = useRef(null);
  const scrubRef = useRef(null);
  const triggerRef = useRef(null);
  const iterationRef = useRef(0);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const colorClasses = [
    "box-1", "box-2", "box-3", "box-4", "box-5", 
    "box-6", "box-7", "box-8", "box-9", "box-10", "box-11"
  ];

  const getColorClass = () => {
    const colorClass = colorClasses[colorIndex.current % colorClasses.length];
    colorIndex.current++;
    return colorClass;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        formData,
        process.env.REACT_APP_EMAILJS_USER_ID
      );
      
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      
      timeoutRef.current = setTimeout(() => {
        setIsSubmitted(false);
        setIsSubmitting(false);
      }, 3000);
    } catch (err) {
      console.error('Email failed to send:', err);
      setError('Failed to send message. Please try again.');
      setIsSubmitting(false);
    }
  };
  
  useEffect(() => {
    document.body.style.cursor = 'none';

    // Create ScrollSmoother
    const smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1,
      effects: true,
      smoothTouch: 0.1
    });

    // Certificate card animation
    const certCards = document.querySelectorAll('.cert-card');
    const certObserver = new IntersectionObserver((entries) => {
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
      certObserver.observe(card);
    });

    // Tools animations
    animate(".text-head", { opacity: 1, y: 0 }, { delay: 0.3, duration: 0.8 });
    
    inView(".scroll-section", (element) => {
      const sectionIndex = Array.from(document.querySelectorAll('.scroll-section')).indexOf(element);
      const delay = sectionIndex * 0.15;
      
      animate(
        element.querySelector(".category-title"),
        { opacity: 1, y: 0 },
        { delay, duration: 0.7 }
      );
      
      animate(
        element.querySelectorAll(".tool-card"),
        { opacity: 1, scale: [0.9, 1], y: 0 },
        { delay: stagger(0.08, { start: delay + 0.2 }), duration: 0.5 }
      );
      
      return () => {
        animate(element.querySelector(".category-title"), { opacity: 0, y: 20 }, { duration: 0.1 });
        animate(element.querySelectorAll(".tool-card"), { opacity: 0, scale: 0.9 }, { duration: 0.1 });
      };
    });

    // Project Carousel Setup - Horizontal Slide with Center Focus
    const setupProjectCarousel = () => {
      const projectCards = gsap.utils.toArray('.project-carousel-card');
      if (projectCards.length === 0) return;

      let currentIndex = 0;
      const cardWidth = 1050; // Width of each card (increased)
      const gap = 80; // Gap between cards

      // Initialize all cards - position horizontally (all same size)
      projectCards.forEach((card, index) => {
        const distance = index - currentIndex;
        const isCurrent = index === currentIndex;
        gsap.set(card, {
          x: distance * (cardWidth + gap),
          scale: 1, // All cards same size
          opacity: isCurrent ? 1 : 0.5,
          zIndex: isCurrent ? 100 : 10
        });
      });

      const updateCards = (newIndex) => {
        projectCards.forEach((card, index) => {
          const distance = index - newIndex;
          const isCurrent = index === newIndex;
          gsap.to(card, {
            x: distance * (cardWidth + gap),
            scale: 1, // All cards same size
            opacity: isCurrent ? 1 : 0.5,
            zIndex: isCurrent ? 100 : 10,
            duration: 0.6,
            ease: "power2.out"
          });
        });
        currentIndex = newIndex;
      };

      // Button click handlers
      const nextBtn = document.querySelector('.project-next');
      const prevBtn = document.querySelector('.project-prev');
      
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          const nextIndex = (currentIndex + 1) % projectCards.length;
          updateCards(nextIndex);
        });
      }
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          const prevIndex = (currentIndex - 1 + projectCards.length) % projectCards.length;
          updateCards(prevIndex);
        });
      }

      // Draggable setup for mobile
      let startIndex = currentIndex;
      Draggable.create('.drag-proxy', {
        type: "x",
        trigger: ".project-carousel",
        onPress() {
          startIndex = currentIndex;
        },
        onDrag() {
          const dragAmount = this.x - this.startX;
          if (Math.abs(dragAmount) > 50) {
            if (dragAmount < 0 && currentIndex < projectCards.length - 1) {
              updateCards(currentIndex + 1);
            } else if (dragAmount > 0 && currentIndex > 0) {
              updateCards(currentIndex - 1);
            }
          }
        }
      });
    };

    setTimeout(setupProjectCarousel, 100);

    return () => {
      document.body.style.cursor = 'default';
      if (smoother) smoother.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
      certCards.forEach(card => certObserver.unobserve(card));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (seamlessLoopRef.current) seamlessLoopRef.current.kill();
      if (scrubRef.current) scrubRef.current.kill();
      if (triggerRef.current) triggerRef.current.kill();
    };
  }, []);

  return (
    <>
      <CustomCursor />
      <Navigation />

      <div id="smooth-wrapper">
        <div id="smooth-content">
          {/* HOME SECTION */}
      <section id="home" className='main-contain'>
        <div className="App">
          <motion.div
            className="header-container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="header-container2">
              <aside>
                <motion.img
                  className="picture"
                  src={picture}
                  alt="Profile"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                />
                <motion.div
                  className="description-pic"
                  variants={containerVariants}
                >  
                  <motion.h1 className="name" variants={itemVariants}>
                    Chad Bojelador
                  </motion.h1>
                  <motion.p variants={itemVariants}>
                    A Full Stack Developer as well as a Bachelor of Science in Information Technology.
                  </motion.p>
                </motion.div>
              </aside>
              <div className="content-wrapper">
                <div className='content-container'>
                  <motion.div
                    className="title-container"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.h1
                      className="Title"
                      variants={itemVariants}
                      initial={{ x: -50 }}
                      animate={{ x: 0 }}
                      transition={{ type: 'spring' }}
                    >
                      FULL STACK
                    </motion.h1>
                    <motion.h1
                      className="Title"
                      id="title1"
                      variants={itemVariants}
                      initial={{ x: -50 }}
                      animate={{ x: 0 }}
                      transition={{ type: 'spring', delay: 0.1 }}
                    >
                      DEVELOPER
                    </motion.h1>
                    <motion.div className="p-container" variants={containerVariants}>
                      <motion.p variants={itemVariants}>
                        Focused on building software that drives impact
                      </motion.p>
                      <motion.p variants={itemVariants}>
                        with intuitive design and seamless functionality.
                      </motion.p>
                    </motion.div>
                  </motion.div>

                  <motion.div
                    className="boxes"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {['ReactJS','C++','Java','Python','Qt','MySQL','NodeJS','HTML','CSS','Javascript','Tailwind'].map((tech, idx) => (
                      <motion.div
                        key={idx}
                        className={`box box-${idx+1}`}
                        variants={itemVariants}
                        whileHover={{ scale: 1.05 }}
                      >
                        <p>{tech}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Signages />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CERTIFICATES AND EXPERIENCE SECTION */}
      <section id="certificates" className="cert-exp-wrapper">
        <div className="cert-container">
          <div className="floating">{'{ }'}</div>
          <div className="floating">;</div>
          <div className="cert-hero">
            <motion.h1 
              className="cert-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Professional Certifications
            </motion.h1>
            <motion.p 
              className="cert-subtitle"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Showcasing continuous learning and expertise across multiple domains
            </motion.p>
          </div>

          <div className="certs-list">
            {certificates.map((cert, index) => (
              <motion.div 
                key={cert.id || index} 
                className="cert-item"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="cert-item-header">
                  <div className="cert-item-main">
                    <h3 className="cert-name">{cert.title}</h3>
                    <span className="cert-issuer">{cert.issuer}</span>
                    <span className="cert-date">{cert.date}</span>
                  </div>
                  <a 
                    href={cert.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="cert-link"
                  >
                    View →
                  </a>
                </div>
                <p className="cert-description">{cert.description}</p>
                <div className="cert-tags">
                  {cert.tags.map((tag, idx) => (
                    <span key={idx} className="cert-tag">{tag}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="exp-container">
          <Experiences />
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section id="projects" className="project-container">
        {/* PROJECT CAROUSEL */}
        <div className="project-section-wrapper">
          <div className="project-header">
            <h1 className="project-title">PROJECT SHOWCASE</h1>
          </div>
          
          <div className="project-gallery">
            <div className="drag-proxy"></div>
            <ul className="project-carousel">
              {projects.map((project, index) => (
                <li key={index} className="project-carousel-card">
                  <ProjectPanel 
                    title={project.title}
                    details={project.details}
                    videoSrc={project.videoSrc}
                    link={project.link}
                  />
                </li>
              ))}
            </ul>
          </div>
          <div className="project-actions">
            <button className="project-prev">Previous</button>
            <button className="project-next">Next</button>
          </div>
        </div>

        <div className="intro-wrapper">
          <div className="intro" style={{ zIndex: 1 }}>
            <div className="text-align-center" id="js-pin">
              <div className="max-width-small align-center">
                <div className="margin-bottom margin-small">
                  <h2 className="heading-style-h3">
                    <span className="light-green-underline">
                      INNOVATIVE SOLUTIONS AND MEASURABLE IMPACT
                    </span>
                  </h2>
                </div>
                <div className="des">
                  <p className="text-size-medium">
                    I build scalable and user-centered applications designed to solve real-world problems.
                    My projects span various domains, from system management tools to productivity and data-driven applications.
                    I focus on delivering clean, efficient, and maintainable solutions that prioritize functionality and user experience.
                    Every project is an opportunity to innovate, learn, and create meaningful impact through technology.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TOOLS SECTION */}
      <section id="tools" className="tools-page">
        <div className="head">
          <h1 className="text-head">MY ARSENAL</h1>
        </div>
        
        <div className="tool-scroll">
          {tools.map((section, sectionIndex) => (
            <div key={sectionIndex} className="scroll-section">
              <h2 className="category-title">{section.category}</h2>
              <div className="tools-container">
                {section.items.map((tool, toolIndex) => (
                  <div key={toolIndex} className={`tool-card ${getColorClass()}`}>
                    <span>{tool}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="about" className="contact-page">
        <div className="contact-container">
          <div className="contact-content">
            <div className="contact-header">
              <h1 className="contact-title">Get in Touch</h1>
              <p className="contact-subtitle">
                Have a question or want to work together? Send me a message!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your Name"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="What's this about?"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Your message here..."
                  rows="6"
                  className="form-textarea"
                ></textarea>
              </div>

              {error && <p className="error-message">{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`submit-btn ${isSubmitted ? 'success' : ''}`}
              >
                {isSubmitting ? 'Sending...' : isSubmitted ? '✓ Sent!' : 'Send Message'}
              </button>
            </form>

            <div className="contact-info">
              <div className="info-item">
                <span className="info-icon">📧</span>
                <span>chadbojelador@gmail.com</span>
              </div>
              <div className="info-item">
                <span className="info-icon">📍</span>
                <span>Quezon City, Philippines</span>
              </div>
            </div>
          </div>
        </div>
      </section>
        </div>
      </div>
    </>
  );
}

export default App;