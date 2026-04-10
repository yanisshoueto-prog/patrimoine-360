import { motion } from 'framer-motion';

export const Logo = ({ className = '' }) => {
  return (
    <svg viewBox="0 0 440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Empreinte digitale / Onde sonore externe / Masque */}
      <motion.g transform="translate(10, 0)">
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          d="M20,50 C20,30 35,15 50,15 C65,15 80,30 80,50"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.2, ease: "easeInOut" }}
          d="M28,50 C28,38 38,28 50,28 C62,28 72,38 72,50"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.4, ease: "easeInOut" }}
          d="M36,50 C36,43 43,36 50,36 C57,36 64,43 64,50"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        
        {/* Forme du Cauri central / Masque africain */}
        <motion.path
          initial={{ fillOpacity: 0 }}
          animate={{ fillOpacity: 1 }}
          transition={{ duration: 1.5, delay: 0.8 }}
          d="M50,85 C65,85 75,65 75,50 C75,35 65,15 50,15 C35,15 25,35 25,50 C25,65 35,85 50,85 Z"
          fill="currentColor"
          opacity="0.2"
        />
        
        {/* Fente du cauri */}
        <motion.path
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1, delay: 1.2, ease: "backOut" }}
          style={{ transformOrigin: "50% 50%" }}
          d="M50,25 C47,35 47,65 50,75 C53,65 53,35 50,25 Z"
          fill="currentColor"
        />
      </motion.g>

      {/* Texte du Logo Inclus */}
      <motion.text
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        x="105" 
        y="62" 
        fontFamily="Playfair Display, serif" 
        fontWeight="800"
        fontSize="40" 
        fill="currentColor"
        letterSpacing="-0.02em"
      >
        Patrimoine 360°
      </motion.text>
    </svg>
  );
};
