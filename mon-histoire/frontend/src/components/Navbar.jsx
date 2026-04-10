import { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, Sun, Moon, X, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { Logo } from './Logo';

const NAV_LINKS = [
  { href: '/explore', label: 'La Collection' },
  { href: '/about', label: 'Notre Histoire' },
];

export const Navbar = () => {
  const { token, logout, darkMode, toggleTheme } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isActive = (href) => location.pathname === href;

  return (
    <>
      <nav className="fixed top-0 w-full z-50 px-5 py-4 bg-lightBkg/90 dark:bg-background/90 backdrop-blur-xl border-b border-background/5 dark:border-lightBkg/5 transition-colors duration-500">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center gap-4">

          <Link to="/" onClick={() => setMenuOpen(false)} className="flex-shrink-0">
            <Logo className="h-9 md:h-11 text-background dark:text-lightBkg" />
          </Link>

          <div className="hidden lg:flex items-center space-x-10 font-sans text-[11px] font-bold uppercase tracking-[0.25em]">
            {NAV_LINKS.map(link => (
              <Link key={link.href} to={link.href}
                className={`transition-colors ${isActive(link.href) ? 'text-accent' : 'text-background/60 dark:text-lightBkg/60 hover:text-accent'}`}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={toggleTheme}
              className="p-2.5 rounded-full border border-background/10 dark:border-white/10 text-background dark:text-lightBkg hover:border-accent/50 transition-all">
              {darkMode ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {token ? (
              <>
                <Link to="/dashboard"
                  className="hidden sm:flex px-5 py-2.5 rounded-full bg-accent text-background font-sans font-bold text-[11px] uppercase tracking-wider hover:bg-accent/80 transition-all shadow-lg shadow-accent/20">
                  Mon Espace
                </Link>
                <button onClick={logout}
                  className="hidden sm:flex p-2.5 rounded-full border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                  <LogOut size={17} />
                </button>
              </>
            ) : (
              <Link to="/login"
                className="hidden sm:flex px-5 py-2.5 rounded-full bg-accent text-background font-sans font-bold text-[11px] uppercase tracking-wider hover:bg-accent/80 transition-all shadow-lg shadow-accent/20">
                Artisan Access
              </Link>
            )}

            <button onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden w-10 h-10 rounded-full border border-background/10 dark:border-white/10 flex items-center justify-center text-background dark:text-lightBkg hover:border-accent transition-all"
              aria-label="Menu">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed inset-0 z-40 bg-lightBkg dark:bg-background flex flex-col pt-24 pb-10 px-8 overflow-y-auto"
          >
            <div className="flex flex-col gap-0 flex-1">
              {NAV_LINKS.map((link, i) => (
                <motion.div key={link.href}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i }}>
                  <Link to={link.href} onClick={() => setMenuOpen(false)}
                    className={`block font-serif text-[2.8rem] leading-tight font-black tracking-tighter py-4 border-b border-background/8 dark:border-white/8 transition-colors ${isActive(link.href) ? 'text-accent' : 'text-background dark:text-lightBkg'}`}>
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 }}>
                {token ? (
                  <Link to="/dashboard" onClick={() => setMenuOpen(false)}
                    className="block font-serif text-[2.8rem] leading-tight font-black tracking-tighter py-4 border-b border-background/8 dark:border-white/8 text-background dark:text-lightBkg">
                    Mon Atelier
                  </Link>
                ) : (
                  <Link to="/login" onClick={() => setMenuOpen(false)}
                    className="block font-serif text-[2.8rem] leading-tight font-black tracking-tighter py-4 border-b border-background/8 dark:border-white/8 text-accent">
                    Espace Artisan
                  </Link>
                )}
              </motion.div>
            </div>

            <div className="flex items-center gap-6 mt-10 pt-6 border-t border-background/8 dark:border-white/8">
              <button onClick={() => { toggleTheme(); }}
                className="flex items-center gap-2.5 text-background/50 dark:text-lightBkg/50 font-sans text-sm font-medium">
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                {darkMode ? 'Mode Clair' : 'Mode Sombre'}
              </button>
              {token && (
                <button onClick={() => { logout(); setMenuOpen(false); }}
                  className="ml-auto flex items-center gap-2 text-red-500 font-sans text-sm font-medium">
                  <LogOut size={18} /> Déconnexion
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
