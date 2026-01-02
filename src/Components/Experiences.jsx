import React from 'react';
import { motion } from 'framer-motion';
import '../Styles/experiences.css';

const experiences = [
{
  "title": "Business Intelligence Dashboard Competition (Co-head)",
  "company": "TECHNOFUSION 2025",
  "period": "May 2025",
  "description": "Organized and managed the Data Visualization Competition using Power BI at Technofusion 2025.",
  "achievements": [
    "Led end-to-end planning and execution of an event dashboard competition",
    "Engaged over 10+ participants and coordinated with other organizers",
    "Developed evaluation criteria and streamlined judging process for efficiency"
  ]
},
  {
    title: "NASA INTERNATIONAL SPACE APPS CHALLENGE (HACKATHON)",
    company: "NASA",
    period: "October 2024",
    description: "Created a web app learning material with NASA'S provided data",
    achievements: [
     "Galactic Problem Solver",
"Partnered with fellow developers to create instructional resources focused on Sustainable Development Goals (SDGs).",
"Utilized Git, GitHub, React.js, and CSS for version control, collaboration, and front-end development."

    ]
  }
];

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: i => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.6 } })
};

export default function Experiences() {
  return (
    <div className="experiences-container">
      <motion.header
        className="experiences-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <h1 className="experiences-title">Professional Experience</h1>
        <div className="title-divider" />
      </motion.header>

      <div className="experiences-list">
        {experiences.map((exp, index) => (
          <motion.div
            className="experience-card"
            key={index}
            custom={index}
            variants={cardVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="experience-header">
              <h2 className="experience-title">{exp.title}</h2>
              <div className="experience-subheader">
                <span className="experience-company">{exp.company}</span>
                <span className="experience-period">{exp.period}</span>
              </div>
            </div>

            <p className="experience-description">{exp.description}</p>

            <h3 className="achievements-title">Key Achievements:</h3>
            <ul className="achievements-list">
              {exp.achievements.map((item, i) => (
                <li className="achievement-item" key={i}>
                  <div className="achievement-marker" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
