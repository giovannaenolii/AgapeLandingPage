import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { HeatmapIcon } from './ShaderPrimitives';

// CARDS DE SOLUÇÕES (Altere os títulos, textos e ícones aqui)
const cards = [
  {
    title: 'Engenharia Sob Medida',
    description: 'Desenvolvimento de sistemas robustos e arquiteturas exclusivas que resolvem gargalos operacionais complexos.',
    iconImage: '/hardware.png',
  },
  {
    title: 'Alta Escalabilidade',
    description: 'Arquiteturas desenhadas para crescer sem fricção, suportando fluxos intensos de dados e usuários simultâneos.',
    iconImage: '/code.webp',
  },
  {
    title: 'Soberania Digital',
    description: 'Segurança absoluta e controle total sobre seus dados e infraestrutura, seguindo os mais altos padrões globais.',
    iconImage: '/security.png',
  }
];

export default function Features() {
  return (
    <section id="features" className="features-section py-20 md:py-40 bg-transparent text-[var(--text-color)] relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 md:mb-32 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <span className="section-eyebrow mb-4 block">01 / Nossas soluções</span>
            {/* TÍTULOS DESTA SESSÃO */}
            <h2 className="font-heading font-black text-5xl md:text-7xl leading-[0.9] tracking-tighter">
              Acelerando a Inteligência<br />
              <span className="text-primary italic">Digital.</span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-base md:text-lg opacity-60 max-w-sm mb-2"
          >
            Soluções tecnológicas de ponta que transformam a maneira como empresas líderes operam e inovam.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-[var(--border-color)]">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className={`p-8 md:p-12 flex flex-col border-b border-[var(--border-color)] md:border-b-0 ${i !== 2 ? 'md:border-r md:border-[var(--border-color)]' : ''} hover:bg-primary group transition-colors duration-500`}
            >
              <div className="feature-icon mb-8 md:mb-12 flex-shrink-0">
                <HeatmapIcon
                  className="feature-icon__heatmap"
                  image={card.iconImage}
                  colors={["#112069", "#1f3ca3", "#3265e7", "#6bd8ff", "#ffffff", "#1f3ca3", "#3265e7"]}
                  colorBack="#04112a00"
                  contour={0.5}
                  angle={0}
                  noise={0}
                  innerGlow={0.42}
                  outerGlow={0}
                  speed={1}
                  scale={0.63}
                  offsetX={-0.2}
                />
              </div>

              <h3 className="text-2xl md:text-3xl font-heading font-black mb-4 md:mb-6 tracking-tighter uppercase group-hover:text-white transition-colors">
                {card.title}
              </h3>
              <p className="text-base md:text-lg opacity-60 mb-8 md:mb-12 leading-tight group-hover:text-white/80 transition-colors flex-grow">
                {card.description}
              </p>

              <div className="pt-6">
                <a href="#products" className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] group-hover:text-white transition-colors cursor-pointer">
                  Explorar <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Global CTA */}


      </div>
    </section>
  );
}
