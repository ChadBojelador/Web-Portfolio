// pages/App.jsx
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import picture from '../assets/picture.svg';
import CustomCursor from '../Components/CustomCursor';
import Navigation from '../Components/Navigation';

import Signages from '../Components/Signages';
import '../Styles/index.css'
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
  useEffect(() => {
    document.body.style.cursor = 'none';
    return () => document.body.style.cursor = 'default';
  }, []);

  return (
    <div className='main-contain' >
    <div className="App">
      <CustomCursor />
      <motion.div
        className="header-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Navigation />

        <div className="header-container2" style={{zIndex: 1}}>
          <aside style={{zIndex: 1}}>
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
                A Software Developer as well as a Bachelor of Science in Information Technology.
              </motion.p>
            </motion.div>
          </aside>
            <div className="content-wrapper">
          <section style={{zIndex: 1}}>
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
                SOFTWARE
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

     <Signages></Signages>

            </motion.div>
          
                       </div>
          </section>

          </div>
        </div>

      </motion.div>
 
    </div>
    </div>
  );
}

export default App;