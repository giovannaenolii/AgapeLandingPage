import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LOADING_STEPS = [
  'INICIALIZANDO SISTEMAS ÁGAPE',
  'CONFIGURANDO ARQUITETURA DE SOFTWARE',
  'ESTABELECENDO CONEXÃO SEGURA',
  'SINCRONIZANDO PROTOCOLOS DE DADOS',
  'OTIMIZANDO CAMADA DE PERFORMANCE',
  'SISTEMA PRONTO'
];

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const duration = 3000; 
    const interval = 30; 
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const currentProgress = Math.min(100, Math.floor((currentStep / steps) * 100));
      setProgress(currentProgress);
      
      const nextStepIndex = Math.floor((currentProgress / 100) * (LOADING_STEPS.length - 1));
      
      setStepIndex(prev => {
        if (nextStepIndex !== prev) return nextStepIndex;
        return prev;
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(() => {
          onComplete();
        }, 800);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="w-full max-w-md px-12">
        
        {/* Technical Title */}
        <div className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading font-black text-4xl md:text-5xl text-white tracking-tighter mb-2"
          >
            ÁGAPE<span className="text-primary">SOLUTIONS</span>
          </motion.div>
          <div className="h-4 overflow-hidden">
            <motion.p 
              key={stepIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[8px] font-bold uppercase tracking-[0.4em] text-white/40"
            >
              {LOADING_STEPS[stepIndex]}
            </motion.p>
          </div>
        </div>
        
        {/* Percentage Bar */}
        <div className="w-full h-[1px] bg-white/5 relative overflow-hidden mb-4">
          <motion.div 
            className="absolute inset-0 bg-primary h-full shadow-[0_0_15px_rgba(19,137,212,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Status Line */}
        <div className="flex justify-between items-center text-[8px] font-bold uppercase tracking-widest text-white/20">
          <span>INICIANDO_SISTEMA</span>
          <span>{progress}%</span>
        </div>

      </div>

      {/* Subtle Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(7,16,27,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(46,130,209,0.06),rgba(112,215,255,0.02),rgba(46,130,209,0.06))] bg-[length:100%_2px,3px_100%]" />
    </motion.div>
  );
}
