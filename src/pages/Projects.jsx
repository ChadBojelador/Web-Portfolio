// Projects.jsx
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProjectPanel from '../Components/ProjectPanel';
import CustomCursor from '../Components/CustomCursor';
import Navigation from '../Components/Navigation';
import '../Styles/Projects.css';
import pasyentrack from '../assets/pasyentrack.mp4';
import smw from '../assets/smw.mp4';

gsap.registerPlugin(ScrollTrigger);

function Projects() {
  const ctRef = useRef(null);
  const textLeftRef = useRef(null);
  const textRightRef = useRef(null);
  const tabsSectionRef = useRef(null);
  const introTextRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoSources = [
  pasyentrack,
  smw
];
   const projects = [
        {
            title: "Medical Record Management System Using C++ and Qt Framework",
            details: "The Medical Record Management System, developed using C++ with a graphical user interface, features a stacked widget design that allows smooth navigation between login, patient data entry, and record viewing sections. It combines a MySQL database for persistent data storage with a Binary Search Tree (BST) for efficient in-memory operations such as searching, insertion, and deletion of patient records.",
            videoSrc: videoSources[0],
            link:"https://github.com/ChadBojelador/Medical-Record-Management-System"
        },
        {
            title: "Smart Waste Bin with Plastic Shredder",
            details: "Powered by Arduino Uno R3 components, the system detects and shreds plastic while it records the shredding process and logs data in real-time to Google Sheets via Google Apps Script. Notably, this system has been tested and validated by 10 engineers from diverse fields, ensuring its interdisciplinary applicability.",
            videoSrc: videoSources[1],
            link:"https://drive.google.com/file/d/1CuGlOQnRn8RLUau6sRM7JuAmdNSCld7J/view?usp=drive_link"
        }
    ];
  // IntersectionObserver for "PROJECT / PROFILE"
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            textLeftRef.current.classList.add('animate-left');
            textRightRef.current.classList.add('animate-right');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (ctRef.current) observer.observe(ctRef.current);
    return () => {
      if (ctRef.current) observer.unobserve(ctRef.current);
    };
  }, []);

  // Scroll listener for determining active tab
  useEffect(() => {
    const handleScroll = () => {
      if (!tabsSectionRef.current) return;
      const scrollY = window.scrollY;
      const sectionTop = tabsSectionRef.current.offsetTop;
      const inSection = scrollY - sectionTop;
      const idx = Math.floor(inSection / (window.innerHeight * 1.5));
      setCurrentIndex(Math.min(1, Math.max(0, idx)));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ScrollTrigger pinning
  useEffect(() => {
    if (introTextRef.current) {
      ScrollTrigger.create({
        trigger: '.intro-wrapper',
        start: 'top top',
        end: 'bottom top',
        pin: '.text-align-center',
        pinSpacing: false,
        markers: false,
      });
    }

    if (tabsSectionRef.current) {
      const tabsLeftEl = tabsSectionRef.current.querySelector('.tabs_left');

      ScrollTrigger.create({
        trigger: tabsSectionRef.current,
        start: 'top 5vh',
        end: 'bottom bottom',
        pin: tabsLeftEl,
        pinSpacing: false,
        markers: false,
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div className="project-container">
      <div className="sign">
        <div className="hero-section">
          <div className="hero-content">
            <p>Focused on</p>
            <div className="dropping-texts">
              <div>Growth</div>
              <div>Purpose</div>
              <div>Excellence</div>
              <div>IMPACT!</div>
            </div>
          </div>
        </div>
      </div>

      <div className="nav">
        <Navigation />
        <CustomCursor />
      </div>

      {/* PROJECT / PROFILE */}
      <div className="ct" ref={ctRef}>
        <div className="split-text-container">
          <span className="text-part left" ref={textLeftRef} >PROJECT </span>
          <span className="text-part right" ref={textRightRef}>PROFILE</span>
        </div>
      </div>

      {/* Intro Section */}
      <div className="intro-wrapper">
        <div className="intro" style={{ zIndex: 1 }}>
          <div className="text-align-center" id="js-pin" ref={introTextRef}>
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

      {/* Placeholder space (could be replaced with actual content or tabs section) */}
      <div className="app-container" style={{ height: '250vh' , backgroundColor: 'black', }}>

            <h1 className="header">PROJECT SHOWCASE</h1>
            
            {projects.map((project, index) => (
                <ProjectPanel 
                    key={index}
                    title={project.title}
                    details={project.details}
                         videoSrc={project.videoSrc}
                           link={project.link}
                />
            ))}
 

        </div>
    </div>
  );
}

export default Projects;
