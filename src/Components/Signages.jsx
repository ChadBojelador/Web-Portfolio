import '../Styles/signages.css';
import { motion } from 'framer-motion';

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

const STATS = [
  { value: '+15', label: 'Projects Completed', className: 'sign1' },
  { value: '+10', label: 'Certificates Received', className: 'sign2' },
  { value: '+3',  label: 'Affiliated Organizations', className: 'sign3' },
];

function Signages() {
  return (
    <motion.div
      className="sign-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {STATS.map(({ value, label, className }) => (
        <div key={className} className={className}>
          <motion.h2 variants={itemVariants}>{value}</motion.h2>
          <motion.p variants={itemVariants}>{label}</motion.p>
        </div>
      ))}
    </motion.div>
  );
}

export default Signages;