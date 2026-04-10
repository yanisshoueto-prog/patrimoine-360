import { useState, useRef, useContext, useEffect } from 'react';
import { GlassCard } from '../components/GlassCard';
import {
  Upload, Mic, Square, Save, CheckCircle, AlertCircle,
  RefreshCw, LayoutGrid, PlusCircle, Download, ExternalLink,
  X, ImagePlus, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';

const TECHNIQUES = [
  { value: '', label: 'Sélectionner…' },
  { value: 'bronze', label: 'Fonte au bronze' },
  { value: 'bois', label: 'Sculpture sur bois' },
  { value: 'textile', label: 'Tissage / Textile' },
  { value: 'ceramique', label: 'Céramique / Poterie' },
  { value: 'cauris', label: 'Art des Cauris' },
  { value: 'peinture', label: 'Peinture sur tissu' },
  { value: 'vannerie', label: 'Vannerie' },
  { value: 'autre', label: 'Autre' },
];

const REGIONS = [
  { value: '', label: 'Sélectionner…' },
  { value: 'cotonou', label: 'Cotonou' },
  { value: 'porto-novo', label: 'Porto-Novo' },
  { value: 'ouidah', label: 'Ouidah' },
  { value: 'abomey', label: 'Abomey' },
  { value: 'parakou', label: 'Parakou' },
  { value: 'natitingou', label: 'Natitingou' },
  { value: 'autre', label: 'Autre' },
];

const InputField = ({ label, children }) => (
  <div>
    <label className="block font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-background/50 dark:text-lightBkg/50 mb-2">{label}</label>
    {children}
  </div>
);

const inputClass = "font-sans w-full bg-background/5 dark:bg-white/5 border border-background/10 dark:border-white/10 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-accent text-background dark:text-lightBkg text-sm transition-all";

export const Dashboard = () => {
  const { token, artisanId } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('create');
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');

  // Main image + extra photos
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [extraPhotos, setExtraPhotos] = useState([]); // [{file, preview}]

  // Form fields
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [technique, setTechnique] = useState('');
  const [matiere, setMatiere] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [periode, setPeriode] = useState('');
  const [region, setRegion] = useState('');
  const [signification, setSignification] = useState('');

  const [myArtworks, setMyArtworks] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingGallery, setLoadingGallery] = useState(false);

  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!token) { setTimeout(() => navigate('/login'), 2000); }
  }, [token, navigate]);

  useEffect(() => {
    if (token && activeTab === 'gallery') fetchMyArtworks();
  }, [token, activeTab]);

  const fetchMyArtworks = async () => {
    setLoadingGallery(true);
    try {
      const res = await api.get('/api/artworks/');
      setMyArtworks(res.data);
    } catch { setError("Impossible de charger la collection."); }
    finally { setLoadingGallery(false); }
  };

  if (!token) return (
    <div className="min-h-screen pt-32 flex flex-col items-center justify-center bg-lightBkg dark:bg-background">
      <h2 className="text-3xl font-serif font-bold text-background dark:text-lightBkg mb-3">Accès Interdit</h2>
      <p className="font-sans text-background/50 dark:text-lightBkg/50 italic text-sm">Redirection en cours...</p>
    </div>
  );

  // PDF generation with enriched fields
  const generateAndDownloadPDF = (artworkData) => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    doc.setFillColor(18, 8, 4);
    doc.rect(0, 0, 210, 297, 'F');

    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);
    doc.line(20, 265, 190, 265);

    doc.setTextColor(212, 175, 55);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("MON HISTOIRE", 105, 25, { align: 'center' });

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(180, 150, 100);
    doc.text("CARTEL NUMÉRIQUE DE L'OEUVRE", 105, 42, { align: 'center' });

    // Title
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    const artTitle = artworkData.titre || title || "Œuvre Sans Titre";
    doc.text(artTitle, 105, 65, { align: 'center' });

    // Cultural fields table
    const fields = [
      ["Artisan", artworkData.artisan_details?.nom || "–"],
      ["Région", artworkData.region || "–"],
      ["Technique", artworkData.technique || "–"],
      ["Matière(s)", artworkData.matiere || "–"],
      ["Dimensions", artworkData.dimensions ? `${artworkData.dimensions} cm` : "–"],
      ["Période", artworkData.periode || "–"],
    ];
    doc.setFontSize(9);
    let y = 80;
    fields.forEach(([key, val]) => {
      doc.setTextColor(212, 175, 55);
      doc.setFont("helvetica", "bold");
      doc.text(key.toUpperCase(), 30, y);
      doc.setTextColor(220, 210, 195);
      doc.setFont("helvetica", "normal");
      doc.text(String(val), 90, y);
      y += 10;
    });

    // Signification
    if (artworkData.signification) {
      doc.setFontSize(8);
      doc.setTextColor(180, 160, 130);
      doc.setFont("helvetica", "italic");
      const lines = doc.splitTextToSize(`Signification : ${artworkData.signification}`, 150);
      doc.text(lines, 30, y + 5);
      y += 5 + lines.length * 5;
    }

    // QR Code
    const artUuid = artworkData.uuid || artworkData.id || 'new';
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent('https://mon-histoire.com/artwork/' + artUuid)}&color=D4AF37&bgcolor=120804`;
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      doc.addImage(img, 'PNG', 67.5, 175, 75, 75);
      doc.setFontSize(8);
      doc.setTextColor(180, 150, 100);
      doc.text("Scannez pour écouter l'histoire", 105, 258, { align: 'center' });
      doc.setFontSize(6);
      doc.setTextColor(100, 80, 60);
      doc.text("© Mon Histoire — Héritage Béninois Numérique", 105, 280, { align: 'center' });
      doc.save(`Cartel-${artTitle.replace(/\s+/g, '_')}.pdf`);
    };
    img.onerror = () => doc.save(`Cartel-${artTitle.replace(/\s+/g, '_')}.pdf`);
    img.src = qrUrl;
  };

  const handleMainImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleExtraPhoto = (e) => {
    const files = Array.from(e.target.files);
    const remaining = 4 - extraPhotos.length;
    const toAdd = files.slice(0, remaining);
    toAdd.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setExtraPhotos(prev => [...prev, { file, preview: reader.result }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeExtraPhoto = (idx) => {
    setExtraPhotos(prev => prev.filter((_, i) => i !== idx));
  };

  const startRecording = () => {
    setError(null);
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { setError("Utilisez Chrome ou Safari pour la dictée."); return; }
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = 'fr-FR';
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.onresult = (event) => {
      let t = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) t += event.results[i][0].transcript + ' ';
      }
      if (t.trim()) setTranscript(prev => prev + t);
    };
    recognitionRef.current.onerror = () => setIsRecording(false);
    recognitionRef.current.onend = () => setIsRecording(false);
    recognitionRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsRecording(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !imageFile) { setError("À minima un titre et une photo sont requis."); return; }
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append('titre', title);
    if (transcript) formData.append('storytelling_texte', transcript);
    formData.append('image', imageFile);
    if (price) formData.append('prix', price);
    if (technique) formData.append('technique', technique);
    if (matiere) formData.append('matiere', matiere);
    if (dimensions) formData.append('dimensions', dimensions);
    if (periode) formData.append('periode', periode);
    if (region) formData.append('region', region);
    if (signification) formData.append('signification', signification);
    if (artisanId && artisanId !== 'null') formData.append('artisan', artisanId);

    try {
      const res = await api.post('/api/artworks/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const newArtworkId = res.data.id;

      // Upload extra photos sequentially
      for (const photo of extraPhotos) {
        const fd = new FormData();
        fd.append('image', photo.file);
        await api.post(`/api/artworks/${newArtworkId}/add-photo/`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      setIsSuccess(true);
      generateAndDownloadPDF(res.data);
      setTimeout(() => {
        setIsSuccess(false);
        setTitle(''); setTranscript(''); setPrice(''); setTechnique(''); setMatiere('');
        setDimensions(''); setPeriode(''); setRegion(''); setSignification('');
        setImageFile(null); setImagePreview(null); setExtraPhotos([]);
      }, 4000);
    } catch (err) {
      const detail = err.response?.data;
      let msg = "Erreur serveur.";
      if (typeof detail === 'object') msg = Object.entries(detail).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join(' | ');
      setError(msg);
    } finally { setIsSubmitting(false); }
  };

  return (
    <div className="min-h-screen pt-28 md:pt-32 pb-16 px-4 md:px-8 max-w-7xl mx-auto bg-lightBkg dark:bg-background text-background dark:text-lightBkg transition-colors duration-700">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 md:mb-16 gap-6">
        <div>
          <h1 className="font-serif text-4xl md:text-6xl font-black tracking-tighter text-background dark:text-lightBkg">L'Atelier.</h1>
          <p className="font-sans text-sm md:text-base text-background/60 dark:text-lightBkg/60 font-light italic mt-2">
            {activeTab === 'create' ? "Numérisez votre patrimoine." : "Votre exposition personnelle."}
          </p>
        </div>
        <div className="flex gap-1.5 p-1.5 rounded-full bg-background/5 dark:bg-white/5 border border-background/10 dark:border-white/10 w-fit self-start sm:self-auto">
          {[['create', <PlusCircle size={14} />, 'Créer'], ['gallery', <LayoutGrid size={14} />, 'Galerie']].map(([tab, icon, label]) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-sans text-[11px] font-bold uppercase tracking-wider transition-all ${activeTab === tab ? 'bg-background dark:bg-accent text-lightBkg dark:text-background shadow-lg' : 'text-background/60 dark:text-lightBkg/60'}`}>
              {icon} {label}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts */}
      <AnimatePresence>
        {error && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6 p-4 bg-red-500/5 border border-red-500/20 text-red-600 dark:text-red-400 text-xs rounded-2xl flex items-start gap-3 font-sans"><AlertCircle size={16} className="mt-0.5 flex-shrink-0" /> {error}</motion.div>}
        {isSuccess && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6 p-4 bg-green-500/5 border border-green-500/20 text-green-600 dark:text-green-400 text-xs rounded-2xl flex items-center gap-3 font-sans"><CheckCircle size={16} /> Œuvre publiée ! Cartel PDF téléchargé automatiquement.</motion.div>}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {activeTab === 'create' ? (
          <motion.div key="create" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
              {/* Left column */}
              <div className="space-y-6">
                {/* Cover image */}
                <GlassCard className="p-6">
                  <h3 className="font-serif text-xl font-bold mb-5 text-background dark:text-lightBkg">Photo Principale</h3>
                  <div className="relative aspect-[4/3] rounded-2xl border-2 border-dashed border-background/15 dark:border-white/15 hover:border-accent transition-colors flex items-center justify-center overflow-hidden group cursor-pointer bg-background/5 dark:bg-white/5">
                    <input type="file" accept="image/*" onChange={handleMainImage} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" /> : (
                      <div className="flex flex-col items-center text-background/30 dark:text-lightBkg/30">
                        <Upload size={36} className="mb-3 group-hover:text-accent transition-colors" />
                        <span className="font-sans font-bold text-[10px] uppercase tracking-widest">Photo de l'œuvre</span>
                      </div>
                    )}
                  </div>

                  {/* Extra photos */}
                  <div className="mt-4">
                    <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-background/50 dark:text-lightBkg/50 mb-3">Photos Supplémentaires ({extraPhotos.length}/4)</p>
                    <div className="flex flex-wrap gap-3">
                      {extraPhotos.map((p, i) => (
                        <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-background/10 dark:border-white/10">
                          <img src={p.preview} className="w-full h-full object-cover" alt={`extra-${i}`} />
                          <button onClick={() => removeExtraPhoto(i)} className="absolute top-1 right-1 bg-red-500 rounded-full p-0.5"><X size={10} className="text-white" /></button>
                        </div>
                      ))}
                      {extraPhotos.length < 4 && (
                        <label className="w-20 h-20 rounded-xl border-2 border-dashed border-background/15 dark:border-white/15 flex flex-col items-center justify-center cursor-pointer hover:border-accent transition-colors text-background/40 dark:text-lightBkg/40">
                          <input type="file" accept="image/*" multiple onChange={handleExtraPhoto} className="hidden" />
                          <ImagePlus size={20} className="mb-1" />
                          <span className="text-[8px] font-bold uppercase tracking-wider">Ajouter</span>
                        </label>
                      )}
                    </div>
                  </div>
                </GlassCard>

                {/* Infos de base */}
                <GlassCard className="p-6">
                  <h3 className="font-serif text-xl font-bold mb-5 text-background dark:text-lightBkg">Informations</h3>
                  <div className="space-y-4">
                    <InputField label="Titre de l'œuvre *">
                      <input type="text" value={title} onChange={e => setTitle(e.target.value)} className={inputClass} placeholder="Ex : Masque Gèlèdé de Porto-Novo" />
                    </InputField>
                    <div className="grid grid-cols-2 gap-4">
                      <InputField label="Valeur (FCFA)">
                        <input type="number" value={price} onChange={e => setPrice(e.target.value)} className={inputClass} placeholder="Optionnel" />
                      </InputField>
                      <InputField label="Période / Année">
                        <input type="text" value={periode} onChange={e => setPeriode(e.target.value)} className={inputClass} placeholder="Ex : XIXe siècle" />
                      </InputField>
                    </div>
                  </div>
                </GlassCard>

                {/* Cartel culturel */}
                <GlassCard className="p-6">
                  <h3 className="font-serif text-xl font-bold mb-5 text-background dark:text-lightBkg">Cartel Culturel</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <InputField label="Technique">
                        <select value={technique} onChange={e => setTechnique(e.target.value)} className={inputClass + " appearance-none"}>
                          {TECHNIQUES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                      </InputField>
                      <InputField label="Région d'origine">
                        <select value={region} onChange={e => setRegion(e.target.value)} className={inputClass + " appearance-none"}>
                          {REGIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                        </select>
                      </InputField>
                    </div>
                    <InputField label="Matière(s)">
                      <input type="text" value={matiere} onChange={e => setMatiere(e.target.value)} className={inputClass} placeholder="Ex : Bronze, bois de iroko, cauris" />
                    </InputField>
                    <InputField label="Dimensions (h × l × p en cm)">
                      <input type="text" value={dimensions} onChange={e => setDimensions(e.target.value)} className={inputClass} placeholder="Ex : 45 × 30 × 20" />
                    </InputField>
                    <InputField label="Signification Culturelle">
                      <textarea value={signification} onChange={e => setSignification(e.target.value)} className={inputClass + " resize-none min-h-[80px]"} placeholder="Quelle est la symbolique ou la valeur rituelle de cette œuvre ?" />
                    </InputField>
                  </div>
                </GlassCard>
              </div>

              {/* Right column: Storytelling */}
              <div>
                <GlassCard className="p-6 md:p-8 sticky top-28 flex flex-col border-t-4 border-t-accent">
                  <h3 className="font-serif text-2xl md:text-3xl font-bold mb-2 text-background dark:text-lightBkg">La Voix de l'Artiste</h3>
                  <p className="font-sans text-xs text-background/50 dark:text-lightBkg/50 italic mb-8 font-light">Parlez : votre histoire sera transcrite automatiquement. Ou tapez directement.</p>

                  <div className="flex justify-center mb-8">
                    <motion.button
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all ${isRecording ? 'bg-red-500 animate-pulse text-white' : 'bg-accent text-background'}`}
                    >
                      {isRecording ? <Square size={32} fill="white" /> : <Mic size={32} />}
                    </motion.button>
                  </div>

                  <div className="flex-1 flex flex-col gap-3">
                    <div className="flex justify-between items-center font-sans text-[10px] font-bold uppercase tracking-widest text-background/40 dark:text-lightBkg/40">
                      <span>Récit / Histoire</span>
                      {isRecording && <span className="text-red-500 flex items-center gap-1.5 animate-pulse"><span className="w-1.5 h-1.5 bg-red-500 rounded-full inline-block" />Captation...</span>}
                    </div>
                    <textarea
                      value={transcript} onChange={e => setTranscript(e.target.value)}
                      className="font-sans w-full flex-1 bg-background/5 dark:bg-white/5 border border-background/10 dark:border-white/10 rounded-2xl p-5 outline-none focus:ring-2 focus:ring-accent resize-none text-sm leading-loose text-background dark:text-lightBkg min-h-[280px] transition-all"
                      placeholder="Parlez dans le micro ou tapez ici l'histoire de cette œuvre..."
                    />
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSubmit} disabled={isSubmitting}
                    className="mt-8 w-full py-5 rounded-full bg-background dark:bg-lightBkg text-lightBkg dark:text-background font-sans font-black uppercase text-[11px] tracking-[0.3em] shadow-2xl disabled:opacity-50 flex items-center justify-center gap-3 hover:bg-accent hover:text-background transition-colors"
                  >
                    {isSubmitting ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
                    Publier & Générer Cartel PDF
                  </motion.button>
                </GlassCard>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Gallery tab */
          <motion.div key="gallery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {loadingGallery ? (
              <div className="flex justify-center py-32"><div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" /></div>
            ) : myArtworks.length === 0 ? (
              <div className="text-center py-32 border-2 border-dashed border-background/10 dark:border-white/10 rounded-[3rem]">
                <p className="font-serif text-2xl italic text-background/40 dark:text-lightBkg/40 mb-6">Votre galerie est encore vierge.</p>
                <button onClick={() => setActiveTab('create')} className="font-sans text-accent underline font-bold uppercase text-xs tracking-widest">Créer ma première œuvre</button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {myArtworks.map((art, idx) => (
                  <motion.div key={art.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                    <GlassCard className="p-0 overflow-hidden group border-none">
                      <div className="relative h-56 md:h-64 overflow-hidden">
                        <img src={art.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={art.titre} />
                        <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                          <button onClick={() => generateAndDownloadPDF(art)} className="p-3.5 rounded-full bg-accent text-background shadow-2xl" title="PDF"><Download size={18} /></button>
                          <Link to={`/artwork/${art.id}`} className="p-3.5 rounded-full bg-white text-background shadow-2xl" title="Voir"><ExternalLink size={18} /></Link>
                        </div>
                      </div>
                      <div className="p-5 bg-white dark:bg-[#0c0502] border-t border-background/5 dark:border-white/5">
                        <h4 className="font-serif text-lg font-bold text-background dark:text-lightBkg truncate">{art.titre}</h4>
                        <div className="flex justify-between items-center mt-1.5">
                          <span className="font-sans text-[10px] font-bold text-accent uppercase tracking-widest">{art.technique || art.region || "—"}</span>
                          <span className="font-sans text-[10px] text-background/40 dark:text-lightBkg/40">{art.prix ? `${Number(art.prix).toLocaleString('fr-FR')} FCFA` : ""}</span>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
