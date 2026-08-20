import { useState, useEffect } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import GlassSurface from './GlassSurface';

export default function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDark, setIsDark } = useTheme();

  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  // LINKS DO MENU (Nomes e Destinos)
  const links = [
    { label: 'SOLUÇÕES', href: '#features' },
    { label: 'PRODUTOS', href: '#products' },
    { label: 'MANIFESTO', href: '#about' },
    { label: 'CONTATO', href: '#contact' },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // A V2 mantém a navegação legível nos dois modos desde o primeiro frame.
  const getTextColor = () => {
    if (isDark) return 'text-white';
    return 'text-black';
  };

  const getLogoClass = () => {
    if (isDark) return 'brightness-0 invert';
    return '';
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'py-2 md:py-4' : 'py-4 md:py-6'}`}
    >
      <div className="container mx-auto px-4 md:px-12">
        <GlassSurface
          width="100%"
          height={isScrolled ? 56 : 64}
          borderRadius={50}
          displace={0.5}
          distortionScale={-180}
          redOffset={0}
          greenOffset={10}
          blueOffset={20}
          brightness={50}
          opacity={0.93}
          mixBlendMode="screen"
          className="navbar-glass"
        >
          <div className="relative flex w-full items-center justify-between px-2 md:px-6">
            {/* Logo do Site (Altere o caminho da imagem aqui) */}
            <a href="/" className="flex items-center group">
              <img 
                src="/logo2.png" 
                alt="Ágape Solutions" 
                className={`
                  h-6 md:h-8 w-auto object-contain transition-all duration-300 group-hover:scale-105
                  ${getLogoClass()}
                `} 
              />
            </a>

            {/* Desktop Links - Centralizados absolutamente na página */}
            <div className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  to={`/${link.href}`}
                  className={`
                    text-[10px] font-sans font-bold transition-all duration-300 uppercase tracking-[0.2em] opacity-90 hover:opacity-100 hover:text-primary
                    ${getTextColor()}
                  `}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              <button
                onClick={() => setIsDark(!isDark)}
                className={`p-2 rounded-full transition-all duration-300 
                  ${isDark ? 'bg-white/10 text-white hover:bg-primary' : 'bg-black/5 text-black hover:bg-primary hover:text-white'}
                  `}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun size={14} /> : <Moon size={14} />}
              </button>

              <a 
                href="#contact"
                className="hidden lg:block px-6 md:px-8 py-2 md:py-3 font-heading font-bold text-[9px] md:text-[10px] uppercase tracking-[0.2em] rounded-full transition-all duration-500 shadow-lg bg-primary text-white hover:scale-105"
              >
                SOLICITAR ORÇAMENTO
              </a>

              {/* Mobile Menu Trigger */}
              <button
                onClick={toggleMenu}
                className={`lg:hidden p-2 rounded-full transition-all duration-300 
                  ${getTextColor()}
                `}
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </GlassSurface>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 z-[100] lg:hidden bg-[var(--bg-color)] flex flex-col items-center justify-center p-8"
            >
              {/* Close Button Inside Overlay */}
              <button
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-8 right-8 p-3 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>

              <div className="flex flex-col items-center gap-8 text-center">
                {links.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      to={`/${link.href}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-3xl md:text-5xl font-heading font-black tracking-tighter uppercase text-[var(--text-color)] hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: links.length * 0.1 }}
                  className="mt-8"
                >
                  <a 
                    href="#contact"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-10 py-5 bg-primary text-white font-black text-xs uppercase tracking-[0.2em] rounded-full shadow-2xl"
                  >
                    SOLICITAR ORÇAMENTO
                  </a>
                </motion.div>
              </div>

            {/* Background Branding Elements */}
            <div className="absolute bottom-10 left-10 opacity-5 select-none pointer-events-none">
               <h2 className="text-8xl font-heading font-black leading-none">ÁGAPE</h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
