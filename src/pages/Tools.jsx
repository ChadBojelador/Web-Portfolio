// pages/Tools.jsx
import { useEffect, useRef } from 'react';
import { animate, inView, stagger } from "https://cdn.jsdelivr.net/npm/motion@12.15.0/+esm";
import Navigation from '../Components/Navigation';
import '../Styles/tools.css'

const Tools = () => {
  const tools = [
    {
      category: "Programming Languages",
      items: ["JavaScript (ES6+)", "Python", "Java", "C++", "PHP"]
    },
    {
      category: "Frontend Development",
      items: ["React", "HTML5", "CSS3/Sass", "Tailwind CSS", "Framer Motion"]
    },
    {
      category: "Backend Development",
      items: ["Node.js", "Express", "MySQL", "MongoDB", "REST APIs"]
    },
    {
      category: "Tools & Platforms",
      items: ["Git/GitHub", "VS Code", "Wix", "Figma", "QT Creator", "Vercel"]
    }
  ];

  // Color classes with their specific styles
  const colorClasses = [
    "box-1", "box-2", "box-3", "box-4", "box-5", 
    "box-6", "box-7", "box-8", "box-9", "box-10", "box-11"
  ];

  const colorIndex = useRef(0);

  const getColorClass = () => {
    const colorClass = colorClasses[colorIndex.current % colorClasses.length];
    colorIndex.current++;
    return colorClass;
  };

  useEffect(() => {
    // Main title animation
    animate(".text-head", { opacity: 1, y: 0 }, { delay: 0.3, duration: 0.8 });
    
    // Section animations
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

    // Mouse position tracking for hover effect
    const handleMouseMove = (e) => {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--x', `${x}px`);
      card.style.setProperty('--y', `${y}px`);
    };

    const cards = document.querySelectorAll('.tool-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', handleMouseMove);
    });

    return () => {
      cards.forEach(card => {
        card.removeEventListener('mousemove', handleMouseMove);
      });
    };
  }, []);

  return (
    <div className="App">
      <div className="header-container">
        <Navigation />
        
        <div className="tools-container">
          <section className="scroll-section first-section">
            <div className="section-content">
              <h1 className="text-head">TECHSTACK</h1>
            </div>
          </section>

          {tools.map((toolGroup, index) => (
            <section key={index} className="scroll-section">
              <div className="section-content">
                <h2 className="category-title">{toolGroup.category}</h2>
                <div className="tools-grid">
                  {toolGroup.items.map((item, itemIndex) => {
                    const colorClass = getColorClass();
                    return (
                      <div 
                        key={itemIndex} 
                        className={`tool-card ${colorClass}`}
                      >
                        <div className="tool-content">
                          <span className="tool-text">{item}</span>
                          <div className="tool-hover-effect"></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tools;