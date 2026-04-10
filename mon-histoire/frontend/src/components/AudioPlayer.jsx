import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const AudioPlayer = ({ src, className = '' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Reset state if source changes
    setIsPlaying(false);
  }, [src]);

  const togglePlay = () => {
    if (!src) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className={`flex items-center gap-6 ${className}`}>
      {src && <audio ref={audioRef} src={src} onEnded={() => setIsPlaying(false)} />}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={togglePlay}
        disabled={!src}
        className={`w-20 h-20 rounded-full flex items-center justify-center organic-shape shadow-lg shadow-accent/20 transition-colors ${src ? 'bg-accent text-white hover:bg-[#A0522D]' : 'bg-gray-400 text-gray-200 cursor-not-allowed'}`}
      >
        {isPlaying ? <Pause size={30} fill="currentColor" /> : <Play size={30} fill="currentColor" className="ml-2" />}
      </motion.button>
      <div className="flex flex-col">
        <span className="text-lg font-serif font-bold text-background dark:text-lightBkg">Le Récit</span>
        <span className="text-sm font-medium text-background/60 dark:text-lightBkg/60 flex items-center gap-2">
          <Volume2 size={16} /> 
          {src ? "Écouter l'artisan" : "Aucun audio disponible"}
        </span>
      </div>
    </div>
  );
};
