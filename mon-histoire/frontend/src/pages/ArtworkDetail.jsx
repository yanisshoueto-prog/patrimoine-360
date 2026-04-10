import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AudioPlayer } from '../components/AudioPlayer';
import { QRGenerator } from '../components/QRGenerator';
import {
  Scan, Share2, Heart, MapPin, ArrowLeft, ArrowRight,
  Headphones, X, ChevronLeft, ChevronRight
} from 'lucide-react';
import api from '../api/client';

const TAG_LABELS = {
  bronze: 'Fonte au bronze', bois: 'Sculpture sur bois', textile: 'Tissage',
  ceramique: 'Céramique', cauris: 'Art des Cauris', peinture: 'Peinture',
  vannerie: 'Vannerie', autre: 'Autre'
};

export const ArtworkDetail = () => {
  const { id } = useParams();
  const [showQR, setShowQR] = useState(false);
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePhoto, setActivePhoto] = useState(0); // index in allPhotos
  const [lightbox, setLightbox] = useState(null); // index

  useEffect(() => {
    api.get(`/api/artworks/${id}/`)
      .then(r => setArtwork(r.data))
      .catch(() => setError("Œuvre introuvable."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-lightBkg dark:bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        <p className="font-serif italic text-accent text-lg animate-pulse">Chargement de l'œuvre...</p>
      </div>
    </div>
  );

  if (error || !artwork) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-lightBkg dark:bg-background text-background dark:text-lightBkg p-6 text-center">
      <h2 className="font-serif text-4xl font-bold mb-4">Introuvable</h2>
      <p className="font-sans text-background/60 dark:text-lightBkg/60 mb-8 text-sm">{error}</p>
      <Link to="/explore" className="font-sans px-8 py-3 rounded-full bg-accent text-background font-bold text-xs uppercase tracking-widest">← La Collection</Link>
    </div>
  );

  // Build allPhotos: cover first, then extras
  const extraPhotos = artwork.photos || [];
  const allPhotos = [{ image: artwork.image, legende: artwork.titre }, ...extraPhotos.map(p => ({ image: p.image, legende: p.legende }))];
  const artUuid = artwork.uuid || String(artwork.id);

  const cartelFields = [
    { label: 'Artisan', value: artwork.artisan_details?.nom },
    { label: 'Ville', value: artwork.artisan_details?.ville },
    { label: 'Région', value: artwork.region },
    { label: 'Technique', value: artwork.technique ? TAG_LABELS[artwork.technique] || artwork.technique : null },
    { label: 'Matière(s)', value: artwork.matiere },
    { label: 'Dimensions', value: artwork.dimensions ? `${artwork.dimensions} cm` : null },
    { label: 'Période', value: artwork.periode },
    { label: 'Valeur', value: artwork.prix ? `${Number(artwork.prix).toLocaleString('fr-FR')} FCFA` : null },
  ].filter(f => f.value);

  return (
    <div className="bg-lightBkg dark:bg-background min-h-screen transition-colors duration-700 text-background dark:text-lightBkg">

      {/* ─── MOBILE LAYOUT ─── */}
      <div className="block lg:hidden">
        {/* Hero Photo */}
        <div className="relative h-[60vh] overflow-hidden">
          <img src={allPhotos[activePhoto].image} alt={artwork.titre} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          
          {/* Nav back */}
          <Link to="/explore" className="absolute top-5 left-5 p-3 rounded-full bg-black/30 backdrop-blur text-white z-10">
            <ArrowLeft size={20} />
          </Link>

          {/* Photo strip */}
          {allPhotos.length > 1 && (
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
              {allPhotos.map((_, i) => (
                <button key={i} onClick={() => setActivePhoto(i)}
                  className={`rounded-full transition-all ${i === activePhoto ? 'w-6 h-2 bg-accent' : 'w-2 h-2 bg-white/50'}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Mobile Content */}
        <div className="px-5 pt-8 pb-20 space-y-8">
          {/* Title */}
          <div>
            {artwork.technique && (
              <span className="font-sans inline-block text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-3">{TAG_LABELS[artwork.technique] || artwork.technique}</span>
            )}
            <h1 className="font-serif text-4xl font-black leading-tight">{artwork.titre}</h1>
            {artwork.artisan_details?.nom && (
              <p className="font-sans text-sm text-background/60 dark:text-lightBkg/60 mt-2 flex items-center gap-2">
                <MapPin size={14} className="text-accent" /> {artwork.artisan_details.nom}{artwork.artisan_details.ville && `, ${artwork.artisan_details.ville}`}
              </p>
            )}
          </div>

          {/* Audio */}
          <div className="p-5 rounded-2xl bg-background/5 dark:bg-white/5 border border-background/10 dark:border-white/10 flex items-center gap-5">
            <AudioPlayer src={artwork.storytelling_audio} />
            {artwork.storytelling_audio && <p className="font-sans text-xs text-background/50 dark:text-lightBkg/50 italic">Écoutez l'artisan</p>}
          </div>

          {/* Story */}
          {artwork.storytelling_texte && (
            <div>
              <h3 className="font-serif text-xl font-bold mb-3">Le Récit</h3>
              <p className="font-sans text-sm leading-loose text-background/75 dark:text-lightBkg/75 whitespace-pre-line">{artwork.storytelling_texte}</p>
            </div>
          )}

          {/* Signification */}
          {artwork.signification && (
            <div className="border-l-4 border-accent pl-5 py-2">
              <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-accent mb-2">Signification</p>
              <p className="font-sans text-sm italic leading-relaxed text-background/70 dark:text-lightBkg/70">{artwork.signification}</p>
            </div>
          )}

          {/* Cartel */}
          {cartelFields.length > 0 && (
            <div className="rounded-2xl overflow-hidden border border-background/10 dark:border-white/10">
              {cartelFields.map((f, i) => (
                <div key={i} className={`flex justify-between items-center px-5 py-3.5 font-sans text-sm ${i % 2 === 0 ? 'bg-background/5 dark:bg-white/5' : ''}`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-background/50 dark:text-lightBkg/50">{f.label}</span>
                  <span className="font-medium">{f.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setShowQR(true)} className="font-sans py-4 rounded-xl border border-accent text-accent font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2">
              <Scan size={16} /> QR Code
            </button>
            <button className="font-sans py-4 rounded-xl bg-background dark:bg-lightBkg text-lightBkg dark:text-background font-bold text-xs uppercase tracking-wider">
              Acquérir
            </button>
          </div>
        </div>
      </div>

      {/* ─── DESKTOP LAYOUT ─── */}
      <div className="hidden lg:block">
        <div className="min-h-screen flex">
          
          {/* LEFT: Sticky photo panel */}
          <div className="w-[55%] sticky top-0 h-screen flex flex-col overflow-hidden">
            {/* Main photo */}
            <div className="relative flex-1 overflow-hidden group cursor-pointer" onClick={() => setLightbox(activePhoto)}>
              <motion.img
                key={activePhoto}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                src={allPhotos[activePhoto].image}
                alt={artwork.titre}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/10" />
              
              <Link to="/explore" className="absolute top-8 left-8 p-3 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-accent transition-colors z-10">
                <ArrowLeft size={20} />
              </Link>

              {allPhotos.length > 1 && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); setActivePhoto(p => (p - 1 + allPhotos.length) % allPhotos.length); }}
                    className="absolute left-5 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/25 backdrop-blur text-white hover:bg-accent transition-colors z-10">
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setActivePhoto(p => (p + 1) % allPhotos.length); }}
                    className="absolute right-5 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/25 backdrop-blur text-white hover:bg-accent transition-colors z-10">
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              <div className="absolute bottom-5 right-5 flex gap-3 z-10">
                <button className="p-3.5 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-accent transition-colors"><Heart size={18} /></button>
                <button className="p-3.5 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-accent transition-colors"><Share2 size={18} /></button>
              </div>
            </div>

            {/* Thumbnail strip */}
            {allPhotos.length > 1 && (
              <div className="flex gap-2 p-4 bg-background/5 dark:bg-background border-t border-white/5">
                {allPhotos.map((p, i) => (
                  <button key={i} onClick={() => setActivePhoto(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 transition-all ${i === activePhoto ? 'ring-2 ring-accent scale-95' : 'opacity-50 hover:opacity-80'}`}>
                    <img src={p.image} className="w-full h-full object-cover" alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Scrollable content */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-12 xl:px-20 py-20">

              {/* Badge + Title */}
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-5">
                  {artwork.technique && (
                    <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] bg-accent/10 text-accent px-4 py-1.5 rounded-full">
                      {TAG_LABELS[artwork.technique] || artwork.technique}
                    </span>
                  )}
                  {artwork.region && (
                    <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] border border-background/15 dark:border-white/15 px-4 py-1.5 rounded-full text-background/60 dark:text-lightBkg/60 flex items-center gap-1.5">
                      <MapPin size={10} /> {artwork.region}
                    </span>
                  )}
                </div>
                <h1 className="font-serif text-6xl xl:text-7xl font-black leading-[0.95] tracking-tighter mb-6">
                  {artwork.titre}
                </h1>
                {artwork.artisan_details?.nom && (
                  <p className="font-sans text-base text-background/60 dark:text-lightBkg/60 font-medium">
                    Par {artwork.artisan_details.nom}
                    {artwork.artisan_details.ville && ` · ${artwork.artisan_details.ville}`}
                    {artwork.artisan_details.specialite && ` · ${artwork.artisan_details.specialite}`}
                  </p>
                )}
              </div>

              {/* Storytelling Audio */}
              <div className="mb-12 p-8 rounded-3xl bg-background/[0.03] dark:bg-white/[0.03] border border-background/8 dark:border-white/8 relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-[0.04] pointer-events-none">
                  <Headphones size={120} />
                </div>
                <p className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-6">Écouter le Récit</p>
                <AudioPlayer src={artwork.storytelling_audio} />
              </div>

              {/* Story text */}
              {artwork.storytelling_texte && (
                <div className="mb-14">
                  <h2 className="font-serif text-3xl font-bold mb-6">L'Histoire</h2>
                  <p className="font-sans text-lg leading-[1.9] text-background/75 dark:text-lightBkg/75 font-light whitespace-pre-line">
                    {artwork.storytelling_texte}
                  </p>
                </div>
              )}

              {/* Signification */}
              {artwork.signification && (
                <div className="mb-14 relative pl-8 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-gradient-to-b before:from-accent before:to-accent/20 before:rounded-full">
                  <p className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-4">Signification Culturelle</p>
                  <p className="font-sans text-xl italic leading-relaxed text-background/70 dark:text-lightBkg/70 font-light">
                    "{artwork.signification}"
                  </p>
                </div>
              )}

              {/* Cartel table */}
              {cartelFields.length > 0 && (
                <div className="mb-14">
                  <h2 className="font-serif text-3xl font-bold mb-6">Cartel</h2>
                  <div className="rounded-2xl overflow-hidden border border-background/10 dark:border-white/8">
                    {cartelFields.map((f, i) => (
                      <div key={i} className={`flex justify-between items-center px-6 py-4 font-sans ${i % 2 === 0 ? 'bg-background/[0.03] dark:bg-white/[0.03]' : ''} ${i < cartelFields.length - 1 ? 'border-b border-background/5 dark:border-white/5' : ''}`}>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-background/40 dark:text-lightBkg/40">{f.label}</span>
                        <span className="font-medium text-sm">{f.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Price + Actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 pt-10 border-t border-background/8 dark:border-white/8">
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-widest text-background/40 dark:text-lightBkg/40 mb-1.5 font-bold">Estimation</p>
                  <p className="font-serif text-4xl font-black text-accent">
                    {artwork.prix ? `${Number(artwork.prix).toLocaleString('fr-FR')} FCFA` : "Sur Demande"}
                  </p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowQR(true)}
                    className="flex-1 sm:flex-none font-sans px-8 py-5 rounded-full border border-accent text-accent hover:bg-accent hover:text-background transition-all font-bold text-[11px] uppercase tracking-widest flex items-center justify-center gap-2">
                    <Scan size={16} /> Cartel QR
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.95 }}
                    className="flex-1 sm:flex-none font-sans px-10 py-5 rounded-full bg-background dark:bg-lightBkg text-lightBkg dark:text-background font-bold text-[11px] uppercase tracking-widest shadow-2xl">
                    Acquérir
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQR && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-background/90 backdrop-blur-2xl"
            onClick={() => setShowQR(false)}>
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              className="w-full sm:max-w-sm p-8 sm:p-10 bg-lightBkg dark:bg-[#0d0603] rounded-t-[2.5rem] sm:rounded-[2.5rem] border border-background/10 dark:border-white/10 flex flex-col items-center relative shadow-2xl"
              onClick={e => e.stopPropagation()}>
              <button onClick={() => setShowQR(false)} className="absolute top-5 right-5 p-2 rounded-full hover:bg-accent/10 text-background dark:text-lightBkg">
                <X size={18} />
              </button>
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-3">Cartel Numérique</p>
              <h3 className="font-serif text-2xl font-bold mb-1 text-background dark:text-lightBkg text-center">{artwork.titre}</h3>
              <p className="font-sans text-xs text-background/50 dark:text-lightBkg/50 mb-8 text-center">Scannez pour écouter l'histoire complète</p>
              <div className="p-4 bg-white rounded-2xl shadow-inner mb-6">
                <QRGenerator value={`https://mon-histoire.com/artwork/${artUuid}`} size={190} />
              </div>
              <button onClick={() => setShowQR(false)} className="font-sans w-full py-4 rounded-full bg-accent text-background font-bold text-xs uppercase tracking-widest">Fermer</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}>
            <button className="absolute top-5 right-5 p-3 rounded-full bg-white/10 text-white">
              <X size={22} />
            </button>
            <img src={allPhotos[lightbox].image} className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl" alt="" onClick={e => e.stopPropagation()} />
            {allPhotos.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); setLightbox(p => (p - 1 + allPhotos.length) % allPhotos.length); }}
                  className="absolute left-4 p-4 rounded-full bg-white/10 text-white hover:bg-accent transition-colors"><ChevronLeft size={24} /></button>
                <button onClick={(e) => { e.stopPropagation(); setLightbox(p => (p + 1) % allPhotos.length); }}
                  className="absolute right-4 p-4 rounded-full bg-white/10 text-white hover:bg-accent transition-colors"><ChevronRight size={24} /></button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
