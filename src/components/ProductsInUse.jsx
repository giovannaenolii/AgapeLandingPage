import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DecryptedText from './DecryptedText';
import FlowingMenu from './FlowingMenu';

// LISTA DE CASES EM DESTAQUE (Altere títulos, tags, descrições, imagens e links aqui)
const PRODUCTS = [
  {
    title: 'Nexus AI Plataform',
    tag: 'Retail & AI',
    description: 'Sistema preditivo que aumentou a conversão em 40% para grandes varejistas brasileiros através de análise comportamental em tempo real.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    link: 'https://nexus-ai.agapesolutions.com.br',
    features: ['Machine Learning', 'Big Data', 'Scalability']
  },
  {
    title: 'AgroScale ERP',
    tag: 'Agribusiness',
    description: 'Gestão completa de cadeias de suprimentos agroindustriais, otimizando o escoamento de safra com precisão geoespacial.',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800',
    link: 'https://agroscale.agapesolutions.com.br',
    features: ['IoT', 'Cloud ERP', 'Logistics']
  },
  {
    title: 'SecureVault API',
    tag: 'Fintech & Security',
    description: 'Camada de segurança bancária para fintechs, processando bilhões de requisições com latência zero e criptografia militar.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    link: 'https://securevault.agapesolutions.com.br',
    features: ['Encryption', 'Zero Latency', 'Compliance']
  }
];

export default function ProductsInUse() {
  const navigate = useNavigate();

  const handleSeeAll = (e) => {
    e.preventDefault();
    // Salva o hash na URL para que o botão "Voltar" do navegador retorne a esta seção
    window.history.replaceState(null, '', '/#products');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    navigate('/cases');
  };
  return (
    <section className="pt-14 pb-8 md:py-28 bg-transparent text-[var(--text-color)] relative overflow-hidden" id="products">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">

        <div className="mb-16 md:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8"
          >
            <div className="max-w-3xl">
              <span className="section-eyebrow mb-4 md:mb-6 block">02 / Cases de sucesso</span>
              <h2 className="font-heading font-black text-4xl md:text-7xl leading-[0.85] tracking-tighter">
                <span className="whitespace-nowrap">Onde a engenharia</span><br />
                <DecryptedText
                  text="ganha forma."
                  speed={95}
                  maxIterations={6}
                  sequential
                  revealDirection="start"
                  replayOnView
                  parentClassName="text-primary italic"
                  className="text-primary"
                  encryptedClassName="text-primary opacity-40"
                />
              </h2>
            </div>
            <p className="text-lg md:text-xl opacity-60 max-w-lg md:max-w-xs mb-2">
              Explore como nossas soluções estão redefinindo indústrias e criando novos padrões de eficiência.
            </p>
          </motion.div>
        </div>

        <div className="products-flowing">
          <FlowingMenu
            items={PRODUCTS.map((product, index) => ({
              text: product.title,
              tag: product.tag,
              image: product.image,
              link: product.link,
              external: true,
              index: `0${index + 1}`,
            }))}
          />
        </div>

        <div className="products-notes grid grid-cols-1 md:grid-cols-3 border-b border-[var(--border-color)]">
          {PRODUCTS.map((product, index) => (
            <div key={product.title} className="products-note p-6 md:p-8">
              <div className="flex items-center justify-between gap-4 mb-5">
                <span className="text-[9px] font-black uppercase tracking-[0.22em] text-primary">0{index + 1} / {product.tag}</span>
                <ExternalLink size={15} className="opacity-40" />
              </div>
              <p className="text-sm leading-relaxed opacity-60 mb-6">{product.description}</p>
              <div className="flex flex-wrap gap-2">
                {product.features.map((feature) => <span key={feature} className="text-[8px] font-bold uppercase tracking-wider opacity-60">{feature}</span>)}
              </div>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 md:mt-32 pt-6 md:pt-12 border-t border-[var(--border-color)] flex justify-center"
        >
          <button
            onClick={handleSeeAll}
            className="group relative px-10 py-5 bg-primary text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-full hover:scale-105 transition-all duration-500 flex items-center gap-4 cursor-pointer overflow-hidden shadow-[0_0_40px_rgba(46,130,209,0.3)] hover:shadow-[0_0_60px_rgba(46,130,209,0.55)]"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
            <span className="relative z-10">Ver Todos os Cases</span>
            <ExternalLink size={16} className="relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
          </button>
        </motion.div>

      </div>
    </section>
  );
}
