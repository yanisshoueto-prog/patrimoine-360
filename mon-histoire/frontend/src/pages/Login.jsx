import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { GlassCard } from '../components/GlassCard';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Edit3 } from 'lucide-react';
import { Logo } from '../components/Logo';

export const Login = () => {
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nom, setNom] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isLogin) {
        await login(username, password);
      } else {
        await register({ username, password, nom });
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-24 px-6 bg-lightBkg dark:bg-background transition-colors duration-700 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/black-paper.png")' }}></div>
      
      <GlassCard className="w-full max-w-md p-10 relative z-10">
        <div className="flex flex-col items-center mb-10">
          <Logo className="h-12 text-background dark:text-lightBkg mb-6" />
          <h2 className="text-3xl font-serif font-bold text-background dark:text-lightBkg">
            {isLogin ? 'Accès Artisan' : 'Rejoindre la Galerie'}
          </h2>
          <p className="text-background/50 dark:text-lightBkg/50 text-center mt-2 font-medium text-sm">
            Votre atelier numérique vous attend.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-600 dark:text-red-400 text-sm text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="relative">
              <Edit3 className="absolute left-4 top-4 text-background/40 dark:text-lightBkg/40" size={18} />
              <input 
                type="text" 
                placeholder="Votre nom d'artiste" 
                value={nom}
                onChange={e => setNom(e.target.value)}
                className="w-full bg-background/5 dark:bg-white/5 pl-12 pr-4 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-accent border border-background/10 dark:border-white/10 text-background dark:text-lightBkg"
                required
              />
            </div>
          )}
          <div className="relative">
            <User className="absolute left-4 top-4 text-background/40 dark:text-lightBkg/40" size={18} />
            <input 
              type="text" 
              placeholder="Identifiant" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full bg-background/5 dark:bg-white/5 pl-12 pr-4 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-accent border border-background/10 dark:border-white/10 text-background dark:text-lightBkg"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-4 text-background/40 dark:text-lightBkg/40" size={18} />
            <input 
              type="password" 
              placeholder="Mot de passe" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-background/5 dark:bg-white/5 pl-12 pr-4 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-accent border border-background/10 dark:border-white/10 text-background dark:text-lightBkg"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-5 rounded-full bg-accent text-background font-bold text-xs uppercase tracking-[0.3em] hover:opacity-90 transition shadow-xl shadow-accent/20 mt-4 disabled:opacity-50"
          >
            {loading ? 'Chargement...' : isLogin ? 'Entrer' : 'Créer mon espace'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            type="button" 
            onClick={() => { setIsLogin(!isLogin); setError(null); }}
            className="text-accent text-sm hover:underline transition font-medium"
          >
            {isLogin ? "Pas encore d'atelier ? Créer un compte." : "Déjà un compte ? Se connecter."}
          </button>
        </div>
      </GlassCard>
    </div>
  );
};
