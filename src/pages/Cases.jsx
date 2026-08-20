import { motion } from 'framer-motion';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowLeft, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Grainient from '../components/Grainient';
import { HeatmapIcon } from '../components/ShaderPrimitives';
import Lenis from 'lenis';
import { useTheme } from '../context/ThemeContext';

// LISTA COMPLETA DE CASES (Adicione novos projetos aqui seguindo o mesmo padrão)
const ALL_CASES = [
  {
    id: 1,
    title: 'Nexus AI Plataform',
    category: 'Inteligência de Vendas',
    tag: 'Retail & AI',
    description: 'Sistema preditivo que aumentou a conversão em 40% para grandes varejistas brasileiros através de análise comportamental em tempo real.',
    longDescription: 'A Nexus AI foi desenvolvida para resolver o problema de abandono de carrinho em grandes e-commerces. Utilizando redes neurais recorrentes, a plataforma identifica padrões de hesitação e dispara gatilhos personalizados de retenção, resultando em um aumento direto de receita e fidelização.',
    stats: [
      { label: 'Aumento de Conversão', value: '40%' },
      { label: 'Usuários Ativos', value: '2M+' },
      { label: 'ROI Estimado', value: '12x' }
    ],
    tech: ['PyTorch', 'Next.js', 'Redis', 'AWS SageMaker'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    link: 'https://nexus-ai.agapesolutions.com.br'
  },
  {
    id: 2,
    title: 'AgroScale ERP',
    category: 'Logística Avançada',
    tag: 'Agribusiness',
    description: 'Gestão completa de cadeias de suprimentos agroindustriais, otimizando o escoamento de safra com precisão geoespacial.',
    longDescription: 'O AgroScale ERP integra dados de sensores de campo, previsões climáticas e logística de transporte em uma única interface. Ele permite que produtores e cooperativas gerenciem o fluxo de grãos com eficiência máxima, reduzindo perdas logísticas em até 25%.',
    stats: [
      { label: 'Eficiência Logística', value: '+25%' },
      { label: 'Área Coberta', value: '500k ha' },
      { label: 'Sensores IoT', value: '15k' }
    ],
    tech: ['Go', 'PostgreSQL', 'Grafana', 'IoT Core'],
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800',
    link: 'https://agroscale.agapesolutions.com.br'
  },
  {
    id: 3,
    title: 'SecureVault API',
    category: 'Infraestrutura Crítica',
    tag: 'Fintech & Security',
    description: 'Camada de segurança bancária para fintechs, processando bilhões de requisições com latência zero e criptografia militar.',
    longDescription: 'Desenvolvido para atender às rigorosas normas do Banco Central, o SecureVault é uma API de criptografia e tokenização que protege dados sensíveis de transações financeiras. Sua arquitetura distribuída garante alta disponibilidade e resiliência contra ataques DDoS.',
    stats: [
      { label: 'Disponibilidade', value: '99.999%' },
      { label: 'Latência Média', value: '< 15ms' },
      { label: 'Segurança', value: 'AES-256' }
    ],
    tech: ['Rust', 'Kubernetes', 'HSM', 'gRPC'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    link: 'https://securevault.agapesolutions.com.br'
  },
  {
    id: 4,
    title: 'HealthFlow OS',
    category: 'Healthtech',
    tag: 'Medical Systems',
    description: 'Sistema operacional para hospitais inteligentes que automatiza a triagem e o fluxo de pacientes.',
    longDescription: 'O HealthFlow utiliza visão computacional e sensores de presença para otimizar o tempo de espera em prontos-socorros. O sistema reduz o tempo médio de atendimento em 35% e elimina erros de registro manual.',
    stats: [
      { label: 'Redução de Espera', value: '35%' },
      { label: 'Hospitais', value: '120+' },
      { label: 'Precisão', value: '98%' }
    ],
    tech: ['Python', 'Docker', 'OpenCV', 'React'],
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800',
    link: '#'
  }
];

const TOC_ITEMS = [
  { id: 'case-1', label: 'Nexus AI Plataform', width: '16px' },
  { id: 'case-2', label: 'AgroScale ERP', width: '28px' },
  { id: 'case-3', label: 'SecureVault API', width: '20px' },
  { id: 'case-4', label: 'HealthFlow OS', width: '36px' }
];

const FloatingTOC = ({ isDark }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 250;
      for (const item of TOC_ITEMS) {
        const element = document.getElementById(item.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`fixed right-0 top-1/2 -translate-y-1/2 z-[100] pr-4 md:pr-6 py-10 flex flex-col items-end select-none transition-all duration-500 ${isHovered ? 'pl-10 bg-[#000b18]/60 md:bg-transparent backdrop-blur-md md:backdrop-blur-none rounded-l-3xl shadow-2xl md:shadow-none' : 'pl-4'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsHovered(!isHovered)}
    >
      <div className="flex flex-col gap-5 md:gap-5">
        {TOC_ITEMS.map((item, i) => (
          <a
            key={i}
            href={`#${item.id}`}
            onClick={(e) => {
              e.preventDefault();
              if (isHovered) {
                e.stopPropagation();
                const el = document.getElementById(item.id);
                if (el) {
                  const offset = el.getBoundingClientRect().top + window.scrollY - 100;
                  window.scrollTo({ top: offset, behavior: 'smooth' });
                }
                setTimeout(() => setIsHovered(false), 500);
              }
            }}
            className="flex items-center justify-end gap-3 md:gap-6 group/item cursor-pointer p-2 md:p-0"
          >
            <motion.span
              initial={{ opacity: 0, x: 20 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                x: isHovered ? 0 : 20,
                color: (window.innerWidth < 768 && activeSection === item.id) ? '#1389D4' : (window.innerWidth < 768 ? '#ffffff' : undefined)
              }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: i * 0.02 }}
              className={`text-[10px] md:text-[10px] font-black uppercase tracking-[0.3em] whitespace-nowrap transition-colors ${isHovered ? 'pointer-events-auto' : 'pointer-events-none'} ${window.innerWidth >= 768 ? (isDark ? 'text-white/40 hover:text-white' : 'text-black/40 hover:text-black') : ''}`}
            >
              {item.label}
            </motion.span>
            <motion.div
              animate={{
                width: isHovered ? '24px' : item.width,
                backgroundColor: (activeSection === item.id || isHovered) ? '#1389D4' : isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                scaleX: isHovered ? 1.4 : 1
              }}
              transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
              className="h-[1.5px] rounded-full origin-right shadow-sm"
            />
          </a>
        ))}
      </div>
    </div>
  );
};

export default function Cases() {
  const { isDark } = useTheme();
  const topRef = useRef(null);

  useLayoutEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenis.scrollTo(0, { immediate: true });

    setTimeout(() => {
      lenis.scrollTo(0, { immediate: true });
      window.scrollTo(0, 0);
    }, 10);

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <div
      ref={topRef}
      id="cases-top"
      className={`cases-page min-h-screen transition-colors duration-700 bg-[var(--bg-color)] text-[var(--text-color)]`}
    >
      <div className="cases-page__grainient" aria-hidden="true">
        <Grainient
          color1={isDark ? '#000043' : '#d0d0d1'}
          color2={isDark ? '#003f76' : '#468bc9'}
          color3={isDark ? '#c1dffa' : '#afd8ff'}
          timeSpeed={0.25}
          colorBalance={0}
          warpStrength={1}
          warpFrequency={5}
          warpSpeed={2.1}
          warpAmplitude={50}
          blendAngle={0}
          blendSoftness={0.05}
          rotationAmount={500}
          noiseScale={2}
          grainAmount={0}
          grainScale={2.1}
          grainAnimated={false}
          contrast={1.5}
          gamma={1}
          saturation={1}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
      </div>

      <div className="cases-page__content">
        <Navbar />
        <FloatingTOC isDark={isDark} />

      {/* Hero Section */}
      <section className="relative pt-32 md:pt-40 pb-16 md:pb-20 overflow-hidden">
        <div className={`absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#00609b_0%,_transparent_100%)] ${isDark ? 'opacity-30' : 'opacity-10'}`} />
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Link to="/#products" className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-6 md:mb-8 hover:gap-4 transition-all">
              <ArrowLeft size={14} /> Voltar para Home
            </Link>
            <h1 className="text-4xl sm:text-6xl md:text-9xl font-heading font-black tracking-tighter leading-[0.85] mb-6 md:mb-8">
              CASES DE <br />
              <span className="text-primary italic">EXCELÊNCIA.</span>
            </h1>
            <p className={`text-lg md:text-xl max-w-2xl mx-auto font-sans leading-tight ${isDark ? 'text-white/60' : 'text-black/60'}`}>
              Uma imersão técnica nas soluções que estão transformando mercados através da engenharia de elite.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Cases List */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 gap-20 md:gap-32">
            {ALL_CASES.map((item, index) => (
              <motion.div
                key={item.id}
                id={`case-${item.id}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-10 md:gap-16 items-center scroll-mt-32`}
              >
                {/* Image Side */}
                <div className="w-full lg:w-1/2 group">
                  <div className={`relative aspect-[16/10] overflow-hidden rounded-[2rem] md:rounded-[3rem] border transition-colors ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-60 ${isDark ? 'from-[#000b18]' : 'from-white'}`} />
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="case-globe-button absolute bottom-6 md:bottom-8 right-6 md:right-8 bg-white text-black p-4 md:p-5 rounded-full hover:bg-primary hover:text-white transition-all duration-500 shadow-2xl"
                    >
                      <HeatmapIcon className="case-globe-button__heatmap" />
                      <Globe className="relative z-10" size={20} md:size={24} />
                    </a>
                  </div>
                </div>

                {/* Content Side */}
                <div className="w-full lg:w-1/2">
                  <span className="text-primary font-black uppercase tracking-[0.4em] text-[9px] md:text-[10px] block mb-4">
                    {item.tag}
                  </span>
                  <h2 className="text-4xl md:text-6xl font-heading font-black tracking-tighter leading-none mb-6">
                    {item.title}
                  </h2>
                  <p className={`text-base md:text-lg mb-8 leading-tight font-sans ${isDark ? 'text-white/70' : 'text-black/70'}`}>
                    {item.longDescription}
                  </p>

                  {/* Stats Grid */}
                  <div className={`grid grid-cols-2 sm:grid-cols-3 gap-6 mb-10 p-6 rounded-3xl border transition-colors ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
                    {item.stats.map(stat => (
                      <div key={stat.label}>
                        <div className="text-xl md:text-2xl font-heading font-black text-primary leading-none mb-1">{stat.value}</div>
                        <div className={`text-[8px] uppercase font-black tracking-widest ${isDark ? 'text-white/40' : 'text-black/40'}`}>{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2">
                    {item.tech.map(t => (
                      <span key={t} className={`px-3 md:px-4 py-2 border rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-colors ${isDark ? 'bg-white/5 border-white/10 text-white/60' : 'bg-black/5 border-black/10 text-black/60'}`}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-20 md:py-40">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="bg-primary p-10 md:p-20 rounded-[3rem] md:rounded-[4rem] text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#00e0ff_0%,_transparent_100%)] opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-7xl font-heading font-black tracking-tighter leading-none mb-10 text-white">
                Sua próxima grande <br /> solução começa aqui.
              </h2>
              <Link
                to="/#contact"
                className="inline-block px-10 md:px-12 py-5 md:py-6 bg-white text-black font-black uppercase tracking-[0.2em] rounded-full hover:scale-105 transition-all duration-500 shadow-2xl text-[10px] md:text-xs"
              >
                Vamos Construir Juntos
              </Link>
            </div>
          </div>
        </div>
      </section>

        <Footer />
      </div>
    </div>
  );
}
