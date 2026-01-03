// Projects.jsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProjectPanel from '../Components/ProjectPanel';
import CustomCursor from '../Components/CustomCursor';
import Navigation from '../Components/Navigation';
import { useScrollNavigation } from '../hooks/useScrollNavigation';
import '../Styles/Projects.css';
import { projects } from '../data/projects';

gsap.registerPlugin(ScrollTrigger);

function Projects() {
  const introTextRef = useRef(null);
  useScrollNavigation();

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

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div className="project-container">
      <div className="nav">
        <Navigation />
        <CustomCursor />
      </div>

      {/* NEW SECTION AT TOP OF PROJECTS */}
      <div style={{ minHeight: '100vh', padding: '5rem 0', backgroundColor: 'rgb(21, 19, 18)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '4rem', color: 'white', marginBottom: '2rem', textAlign: 'center' }}>Projects</h1>
          <p style={{ fontSize: '1.2rem', color: '#999', lineHeight: '1.8', textAlign: 'center' }}>
            jskaj
          </p>
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
