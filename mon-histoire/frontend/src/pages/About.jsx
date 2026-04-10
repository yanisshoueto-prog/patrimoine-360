import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Mic, QrCode, Globe } from 'lucide-react';

const values = [
  {
    icon: <Mic size={28} />,
    title: "La Voix d'Abord",
    desc: "Avant le texte, avant l'image, il y a la voix. Celle de l'artisan qui a façonné, taillé, tissé. Mon Histoire capture cette voix pour l'éternité.",
  },
  {
    icon: <QrCode size={28} />,
    title: "Le Cartel Vivant",
    desc: "Un simple QR code transforme n'importe quel objet en portail. En galerie, en marché ou chez soi, l'œuvre se raconte d'elle-même.",
  },
  {
    icon: <Heart size={28} />,
    title: "L'Identité Préservée",
    desc: "Le Bénin abrite des siècles de savoir-faire. Bronze d'Abomey, masques Gèlèdé, tissages de Parakou — ici rien n'est oublié.",
  },
  {
    icon: <Globe size={28} />,
    title: "Un Rayonnement Mondial",
    desc: "Chaque récit numérisé franchit les frontières. De Paris à New York, le monde découvre l'âme des artisans béninois.",
  },
];

const team = [
  { nom: "Adélaïde Houènou", rôle: "Fondatrice & Directrice Artistique", img: "https://i.pinimg.com/1200x/a2/bf/78/a2bf783f3b765cd245e4732a6de279a8.jpg" },
  { nom: "Koffi Tossou", rôle: "Responsable Communauté Artisans", img: "https://i.pinimg.com/736x/7a/dd/71/7add7135cea29bb5f5f128439919b1cf.jpg" },
  { nom: "Célestine Dako", rôle: "Ingénieure Sont & Storytelling", img: "https://i.pinimg.com/736x/ef/78/9f/ef789fe6a2d41c3706f427d0a35be933.jpg" },
];

const stats = [
  { value: "120+", label: "Artisans inscrits" },
  { value: "450+", label: "Œuvres numérisées" },
  { value: "6", label: "Régions du Bénin" },
  { value: "12k", label: "Histoires écoutées" },
];

export const About = () => {
  return (
    <div className="min-h-screen bg-lightBkg dark:bg-background text-background dark:text-lightBkg transition-colors duration-700">

      {/* Hero */}
      <section className="relative min-h-[70vh] flex flex-col items-center justify-center pt-32 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/5 dark:bg-accent/10 blur-[100px]" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-center max-w-4xl relative z-10"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent mb-6">Notre Mission</p>
          <h1 className="text-6xl md:text-8xl font-serif font-black tracking-tighter leading-none mb-8">
            L'Art au Bout <br />
            <em className="font-medium not-italic text-accent">des Doigts.</em>
          </h1>
          <p className="text-xl md:text-2xl font-light text-background/70 dark:text-lightBkg/70 leading-relaxed max-w-2xl mx-auto">
            Mon Histoire est née d'une conviction : chaque objet artisanal béninois porte en lui une vie entière. Il mérite d'être entendu, pas seulement admiré.
          </p>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 border-y border-background/5 dark:border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`flex flex-col items-center justify-center py-12 px-6 ${i < stats.length - 1 ? 'border-b md:border-b-0 md:border-r border-background/10 dark:border-white/10' : ''}`}
              >
                <span className="text-5xl md:text-6xl font-serif font-black text-accent mb-3">{stat.value}</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-background/50 dark:text-lightBkg/50 text-center">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.2)] relative">
              <img
                src="https://i.pinimg.com/1200x/58/6c/14/586c1479861abcf657c423045b0a802d.jpg"
                className="w-full h-full object-cover"
                alt="Artisan béninois"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent flex items-end p-12">
                <p className="text-white font-serif italic text-2xl leading-snug">
                  "Mes mains créent ce que mes mots ne peuvent décrire. Grâce à Mon Histoire, les deux vivent ensemble."
                </p>
              </div>
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-6 -right-6 bg-accent text-background p-6 rounded-3xl shadow-2xl max-w-[200px]">
              <p className="font-serif font-bold text-lg leading-tight">Depuis 2024</p>
              <p className="text-xs font-medium mt-1 opacity-80">Cotonou, Bénin</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-accent mb-4">Notre Histoire</p>
              <h2 className="text-4xl md:text-5xl font-serif font-black leading-tight mb-6">
                Nés d'une passion<br />pour le patrimoine.
              </h2>
              <p className="text-lg font-light text-background/70 dark:text-lightBkg/70 leading-relaxed mb-6">
                Tout a commencé dans un atelier de Cotonou, devant un sculpteur de bronze qui racontait l'histoire de son masque en traçant chaque courbe dans l'air. Nous avons réalisé que cette histoire allait disparaître. L'idée était simple : donner à chaque artisan les outils pour numériser son patrimoine.
              </p>
              <p className="text-lg font-light text-background/70 dark:text-lightBkg/70 leading-relaxed">
                Aujourd'hui, Mon Histoire est la première plateforme africaine de storytelling artisanal — où la technologie sert la culture, et non l'inverse.
              </p>
            </div>
            <Link to="/explore" className="inline-flex items-center gap-3 text-accent font-bold uppercase text-xs tracking-[0.3em] group">
              Découvrir la Collection <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-24 px-6 bg-background/[0.02] dark:bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-accent mb-4">Ce qui nous guide</p>
            <h2 className="text-4xl md:text-5xl font-serif font-black">Nos Valeurs</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-8 rounded-3xl group hover:-translate-y-2 transition-transform duration-500"
              >
                <div className="w-14 h-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-background transition-colors duration-300">
                  {v.icon}
                </div>
                <h4 className="text-xl font-serif font-bold mb-3">{v.title}</h4>
                <p className="text-sm font-light text-background/60 dark:text-lightBkg/60 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Équipe */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-accent mb-4">Les Visages</p>
            <h2 className="text-4xl md:text-5xl font-serif font-black">L'Équipe</h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-10">
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="group text-center"
              >
                <div className="w-full aspect-[3/4] rounded-[2rem] overflow-hidden mb-6 relative">
                  <img
                    src={member.img}
                    alt={member.nom}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h4 className="text-xl font-serif font-bold mb-1">{member.nom}</h4>
                <p className="text-sm text-accent font-medium uppercase tracking-widest">{member.rôle}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center glass-panel p-16 rounded-[3rem] border border-accent/20 relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none" />
           <h2 className="text-4xl md:text-5xl font-serif font-black mb-6 relative z-10">
             Rejoignez le mouvement.
           </h2>
           <p className="text-lg font-light text-background/70 dark:text-lightBkg/70 mb-10 relative z-10 max-w-xl mx-auto">
             Que vous soyez artisan ou musée, il est temps de donner une voix à vos œuvres.
           </p>
           <Link to="/login">
             <motion.button
               whileHover={{ scale: 1.05 }}
               className="px-12 py-5 rounded-full bg-accent text-background font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-accent/30 relative z-10"
             >
               Ouvrir Mon Atelier
             </motion.button>
           </Link>
        </div>
      </section>
    </div>
  );
};
