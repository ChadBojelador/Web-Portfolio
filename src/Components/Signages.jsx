import '../Styles/signages.css';
import { motion } from 'framer-motion';
function Signages (){
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 }
  }
};

    return(
        <>
        <div className="sign-container">
            <div className="sign1">
                <motion.h1 variants={itemVariants}>+15</motion.h1>
                <motion.p variants={itemVariants}>Projects Completed</motion.p>
                </div>            
            <div className="sign2">
                <motion.h1 variants={itemVariants}>+10</motion.h1>
                <motion.p variants={itemVariants}>Certificates Received</motion.p>
                </div>            
            <div className="sign3">
                <motion.h1 variants={itemVariants}>+3</motion.h1>
                <motion.p variants={itemVariants}>Affiliated Organizations</motion.p>
                </div>            

        </div>
        </>
    );

}


export default Signages;