import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Headphones, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/client';

const placeholders = [
  { id: 'p1', titre: 'Masque Gèlèdé', artisan_details: { nom: 'Kolawolé Abiodun', ville: 'Porto-Novo' }, image: '/Masque 3 guelede.webp', storytelling_audio: true, technique: 'bois' },
  { id: 'p2', titre: 'Bronze Royal du Dahomey', artisan_details: { nom: 'Sèmèdo Théodore', ville: 'Abomey' }, image: '/zjhnzs.webp', storytelling_audio: null, technique: 'bronze' },
  { id: 'p3', titre: 'Tissu Kente de Parakou', artisan_details: { nom: 'Akindélé Rose', ville: 'Parakou' }, image: '/sCULPTURE BOIS2.webp', storytelling_audio: true, technique: 'textile' },
  { id: 'p4', titre: 'Poterie Zangbéto', artisan_details: { nom: 'Dossou Martial', ville: 'Ouidah' }, image: '/masque.webp', storytelling_audio: true, technique: 'ceramique' },
  { id: 'p5', titre: 'Statue Vaudou Ancêtre', artisan_details: { nom: 'Zomahoun Eric', ville: 'Cotonou' }, image: '/sCULPTURE BOIS.webp', storytelling_audio: null, technique: 'bois' },
  { id: 'p6', titre: 'Parures de Cauris', artisan_details: { nom: 'Hounwanou Célestine', ville: 'Ouidah' }, image: '/masque2.webp', storytelling_audio: true, technique: 'cauris' },
  { id: 'p7', titre: 'Sculpture Egungun', artisan_details: { nom: 'Fiogbe Antoine', ville: 'Abomey' }, image: '/Egungun 2.webp', storytelling_audio: true, technique: 'bronze' },
  { id: 'p8', titre: 'Vannerie Royale', artisan_details: { nom: 'Agbodja Marie', ville: 'Porto-Novo' }, image: '/Trone.webp', storytelling_audio: null, technique: 'vannerie' },
];

const TECH_LABELS = {
  bronze: 'Bronze', bois: 'Bois', textile: 'Textile',
  ceramique: 'Céramique', cauris: 'Cauris', peinture: 'Peinture',
  vannerie: 'Vannerie', autre: 'Autre',
};

export const Explore = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/api/artworks/')
      .then(r => setArtworks(r.data))
      .catch(() => setError("Impossible de joindre le serveur."))
      .finally(() => setLoading(false));
  }, []);

  const source = artworks.length > 0 ? artworks : placeholders;
  const filtered = source.filter(art =>
    art.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (art.artisan_details?.nom?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-16 px-4 md:px-8 bg-lightBkg dark:bg-background transition-colors duration-700">
      <div className="max-w-[1600px] mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 md:mb-14 gap-5">
          <div>
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.35em] text-accent mb-2 md:mb-3">
              Héritage Béninois
            </p>
            <h1 className="font-serif font-black tracking-tighter leading-none text-background dark:text-lightBkg
              text-[2.8rem] sm:text-[3.5rem] md:text-[5rem]">
              La Collection
            </h1>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-background/40 dark:text-lightBkg/40" size={17} />
            <input type="text" placeholder="Rechercher..."
              className="font-sans w-full bg-background/5 dark:bg-white/5 border border-background/10 dark:border-white/10 pl-11 pr-4 py-3.5 rounded-full outline-none focus:ring-2 focus:ring-accent text-sm text-background dark:text-lightBkg"
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 mb-8 bg-red-500/10 rounded-2xl text-red-500 font-sans text-sm">
            <AlertCircle size={18} /> {error} — Voici des œuvres de démonstration.
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-32">
            <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          /* ────────────────────────
             TRUE PINTEREST MASONRY
             CSS columns = native masonry
          ──────────────────────── */
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4">
            {filtered.map((art, i) => {
              const isPlaceholder = typeof art.id === 'string' && art.id.startsWith('p');
              const href = isPlaceholder ? '/explore' : `/artwork/${art.id}`;
              // Vary heights based on index for organic feel
              const heightClass = i % 5 === 0 ? 'h-72 md:h-96' :
                                  i % 5 === 1 ? 'h-56 md:h-72' :
                                  i % 5 === 2 ? 'h-80 md:h-[28rem]' :
                                  i % 5 === 3 ? 'h-60 md:h-80' :
                                                'h-72 md:h-[22rem]';
              return (
                <motion.div
                  key={art.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.05, 0.4) }}
                  className="break-inside-avoid mb-3 md:mb-4"
                >
                  <Link to={href}>
                    <div className={`relative ${heightClass} rounded-2xl overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer`}>
                      <img
                        src={art.image}
                        alt={art.titre}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      {/* Gradient overlay always-on at bottom */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                      {/* Audio badge */}
                      {art.storytelling_audio && (
                        <div className="absolute top-3 left-3 bg-accent/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1.5">
                          <Headphones size={10} className="text-background" />
                          <span className="font-sans text-[8px] font-bold text-background uppercase tracking-wider">Audio</span>
                        </div>
                      )}

                      {/* Technique badge */}
                      {art.technique && (
                        <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                          <span className="font-sans text-[8px] font-bold text-white/90 uppercase tracking-wider">{TECH_LABELS[art.technique] || art.technique}</span>
                        </div>
                      )}

                      {/* Text always visible at bottom */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="font-serif text-white font-bold leading-tight mb-0.5
                          text-sm md:text-base">
                          {art.titre}
                        </h3>
                        <p className="font-sans text-white/65 text-[10px] font-medium uppercase tracking-wider truncate">
                          {art.artisan_details?.nom}
                          {art.artisan_details?.ville && ` · ${art.artisan_details.ville}`}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
