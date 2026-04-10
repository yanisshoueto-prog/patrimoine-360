import { motion } from 'framer-motion';

export const GlassCard = ({ children, className = '', hover = false }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -8, transition: { duration: 0.4 } } : {}}
      className={`glass-panel rounded-3xl transition-all duration-500 ${className}`}
    >
      {children}
    </motion.div>
  );
};
