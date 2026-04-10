import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye, Sparkles } from 'lucide-react';

const images = [
  "/Masque 3 guelede.webp",
  "/zjhnzs.webp",
  "/Trone.webp",
  "/Egungun 2.webp",
  "/masque.webp",
  "/sCULPTURE BOIS.webp",
];

export const Home = () => {
  const row1 = [...images, ...images];
  const row2 = [...images.slice(2), ...images.slice(2)];

  return (
    <div className="min-h-screen relative overflow-hidden bg-lightBkg dark:bg-background transition-colors duration-700">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/black-paper.png")' }} />

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 px-5 pb-0">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="text-center max-w-5xl mx-auto flex flex-col items-center z-10 relative"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-accent/30 bg-accent/5 text-accent font-sans font-bold uppercase tracking-[0.3em] text-[10px] mb-8"
          >
            <Sparkles size={11} /> Patrimoine Béninois Vivant
          </motion.div>

          <h1 className="font-serif font-black leading-[0.88] tracking-tighter text-background dark:text-lightBkg mb-6
            text-[3.2rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[8rem]">
            L'Art qui<br />
            <span className="text-accent italic font-medium">se raconte.</span>
          </h1>

          <p className="font-sans font-light text-background/65 dark:text-lightBkg/65 leading-relaxed mb-10 max-w-xl
            text-base sm:text-lg md:text-xl">
            Des masques Gèlèdé aux bronzes d'Abomey — écoutez chaque œuvre voix à vous confier ses secrets.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link to="/explore">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-background dark:bg-lightBkg text-lightBkg dark:text-background font-sans font-bold text-[11px] uppercase tracking-[0.25em] shadow-2xl flex items-center justify-center gap-3">
                <Eye size={16} /> Explorer la Collection
              </motion.button>
            </Link>
            <Link to="/login">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto px-8 py-4 rounded-full border border-background/20 dark:border-lightBkg/20 font-sans font-bold text-[11px] uppercase tracking-[0.25em] text-background dark:text-lightBkg flex items-center justify-center gap-3 group">
                Exposer mon Œuvre <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Marquee rows */}
        <div className="w-full mt-16 space-y-4 overflow-hidden" style={{
          maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
        }}>
          {/* Row 1 — left to right */}
          <div className="flex">
            <div className="flex gap-4 animate-marquee flex-shrink-0">
              {row1.map((src, i) => (
                <img key={i} src={src} alt=""
                  className={`object-cover rounded-2xl flex-shrink-0 shadow-xl ${i % 3 === 0 ? 'w-52 h-64 md:w-72 md:h-80' : i % 3 === 1 ? 'w-44 h-56 md:w-60 md:h-72' : 'w-52 h-64 md:w-72 md:h-80'}`}
                  style={{ marginTop: i % 2 === 1 ? '2rem' : '0' }}
                />
              ))}
            </div>
            <div className="flex gap-4 animate-marquee flex-shrink-0" aria-hidden="true">
              {row1.map((src, i) => (
                <img key={i} src={src} alt=""
                  className={`object-cover rounded-2xl flex-shrink-0 shadow-xl ${i % 3 === 0 ? 'w-52 h-64 md:w-72 md:h-80' : i % 3 === 1 ? 'w-44 h-56 md:w-60 md:h-72' : 'w-52 h-64 md:w-72 md:h-80'}`}
                  style={{ marginTop: i % 2 === 1 ? '2rem' : '0' }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE SECTION */}
      <section className="py-24 md:py-32 px-5 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.2)]"
            >
              <img src="/zjhnzs.webp"
                className="w-full h-full object-cover" alt="Bronzes du Bénin" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-transparent to-transparent flex items-end p-8 md:p-12">
                <p className="text-white font-serif italic text-xl md:text-2xl leading-snug">
                  "Chaque coup de ciseau est une prière, chaque bronze est une mémoire."
                </p>
              </div>
              <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 bg-accent text-background p-5 md:p-6 rounded-2xl shadow-2xl">
                <p className="font-serif font-bold text-base md:text-lg leading-tight">Depuis 2024</p>
                <p className="font-sans text-xs font-medium mt-0.5 opacity-80">Cotonou, Bénin</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <p className="font-sans text-[10px] font-bold uppercase tracking-[0.35em] text-accent mb-5">La Plateforme</p>
                <h2 className="font-serif font-black leading-tight tracking-tighter text-background dark:text-lightBkg mb-6
                  text-4xl md:text-5xl">
                  De l'atelier à<br />vos oreilles.
                </h2>
                <p className="font-sans font-light text-background/65 dark:text-lightBkg/65 leading-relaxed text-base md:text-lg">
                  Mon Histoire capture la voix des artisans béninois et la fond avec leurs créations. Chaque QR code imprimé est un portail vers une histoire vivante — en musée, en galerie ou chez vous.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                {[
                  { num: '01', title: 'Audio HD', desc: "L'artisan raconte lui-même." },
                  { num: '02', title: 'QR Cartel', desc: "Scannez, écoutez, ressentez." },
                  { num: '03', title: 'Héritage', desc: "Une archive vivante du Bénin." },
                  { num: '04', title: 'Premium', desc: "Exports PDF prêts à imprimer." },
                ].map(card => (
                  <div key={card.num} className="p-6 rounded-2xl border border-background/8 dark:border-white/8 bg-background/[0.02] dark:bg-white/[0.02] hover:border-accent/30 transition-colors group">
                    <span className="font-serif text-3xl font-black text-accent/30 group-hover:text-accent transition-colors">{card.num}</span>
                    <h4 className="font-serif font-bold text-lg mt-2 mb-1 text-background dark:text-lightBkg">{card.title}</h4>
                    <p className="font-sans text-sm text-background/55 dark:text-lightBkg/55 font-light">{card.desc}</p>
                  </div>
                ))}
              </div>

              <Link to="/explore" className="inline-flex items-center gap-3 text-accent font-sans font-bold uppercase text-[11px] tracking-[0.25em] group">
                Voir la Collection <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};
