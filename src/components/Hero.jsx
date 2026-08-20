import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowRight, MousePointer2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { NeuroBackdrop, PaperGrain, WaveField } from './ShaderPrimitives';

export default function Hero() {
  const { isDark } = useTheme();

  return (
    <section className={`hero-shell relative h-screen w-full flex items-center justify-center overflow-hidden ${isDark ? 'hero-shell--dark' : 'hero-shell--light'}`}>
      <NeuroBackdrop interactive={false} />
      <WaveField interactive={false} />
      <PaperGrain className="opacity-[0.18] mix-blend-soft-light" />
      <div className="hero-vignette" />

      <div className="relative z-10 w-full max-w-[1480px] mx-auto px-6 md:px-12 pt-20 lg:pt-12">
        <div className="mx-auto max-w-[980px] text-center">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center justify-center gap-3 mb-7"
            >
              <span className="hero-kicker">ENGENHARIA DE ELITE</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="hero-title mx-auto font-heading font-black text-[14vw] sm:text-[12vw] md:text-[8vw] lg:text-[7vw] leading-[0.82] tracking-tighter mb-8 md:mb-10"
            >
              <span className="hero-title__main">ÁGAPE<br />SOLUTIONS</span><br />
              <span className="hero-title__tagline">TECH FOR<br />THE FUTURE.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="hero-copy mx-auto font-sans text-base md:text-lg max-w-3xl mb-10 md:mb-12 leading-[1.3]"
            >
              Transformamos visões complexas em arquiteturas de software impecáveis.
              Sistemas escaláveis, seguros e desenhados para o próximo nível do seu negócio.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4"
            >
              <a href="#features" className="hero-button hero-button--quiet w-full sm:w-auto px-8 py-4">
                <MousePointer2 size={16} /> VER SOLUÇÕES
              </a>
              <a href="#contact" className="hero-button hero-button--primary group w-full sm:w-auto px-8 py-4">
                COMEÇAR PROJETO <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span>SCROLL TO EXPLORE</span>
        <ArrowDownRight size={15} />
      </motion.div>
    </section>
  );
}
