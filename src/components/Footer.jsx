import { lazy, Suspense } from 'react';
import DecryptedText from './DecryptedText';

const ShapeBlur = lazy(() => import('./ShapeBlur'));

// LINKS DAS COLUNAS DO RODAPÉ (Altere nomes e links aqui)

const NAV = [
  {
    heading: 'SOLUÇÕES',
    links: [
      { label: 'SOFTWARE', href: '#features' },
      { label: 'PRODUTOS', href: '#products' },
      { label: 'MÉTRICAS', href: '#enterprise' },
    ],
  },
  {
    heading: 'RECURSOS',
    links: [
      { label: 'ESPECIFICAÇÕES', href: '#' },
      { label: 'CHANGELOG', href: '#' },
      { label: 'STATUS', href: '#' },
    ],
  },
  {
    heading: 'EMPRESA',
    links: [
      { label: 'MANIFESTO', href: '#about' },
      { label: 'CONTATO', href: '#contact' },
    ],
  },
];

// LINKS DAS REDES SOCIAIS (Altere os links em 'href')
const SOCIALS = [
  {
    name: 'Twitter',
    href: 'https://twitter.com',
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
      </svg>
    )
  },
  {
    name: 'Linkedin',
    href: 'https://linkedin.com',
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    )
  },
  {
    name: 'Github',
    href: 'https://github.com',
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
        <path d="M9 18c-4.51 2-5-2-7-2" />
      </svg>
    )
  },
  {
    name: 'Whatsapp',
    href: 'https://wa.me/5500000000000', // Altere para o número real do cliente
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-13.7 8.38 8.38 0 0 1 3.8.9L21 3l-1.5 4.7a8.38 8.38 0 0 1 .9 3.8z" />
      </svg>
    )
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-transparent text-[var(--text-color)] border-t border-[var(--border-color)] overflow-hidden">

      <div className="footer-shape-blur">
        <Suspense fallback={null}>
          <ShapeBlur variation={2} />
        </Suspense>
      </div>

      {/* ── Background Watermark ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none">
        <span className="font-heading font-black text-[50vw] md:text-[30vw] whitespace-nowrap tracking-tighter opacity-[0.03] uppercase">
          ÁGAPE
        </span>
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-20">

          {/* Brand Block */}
          <div className="max-w-md">
            <img
              src="/logo2.png"
              alt="Ágape Solutions"
              className="h-6 md:h-8 w-auto mb-6 md:mb-8 dark:brightness-0 dark:invert transition-all"
            />
            <p className="opacity-40 font-sans text-xs md:text-sm leading-relaxed mb-8 md:mb-12">
              Construindo o futuro da engenharia de software com arquiteturas robustas e de alta performance. Desenvolvido para quem não aceita nada menos que a excelência técnica.
            </p>
            <div className="flex gap-6">
              {SOCIALS.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="opacity-40 hover:text-primary hover:opacity-100 transition-all duration-300"
                >
                  <social.icon size={18} md:size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 md:gap-12">
            {NAV.map((col) => (
              <div key={col.heading}>
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-6 md:mb-8">
                  {col.heading}
                </p>
                <div className="flex flex-col gap-3 md:gap-4">
                  {col.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="text-[11px] md:text-xs opacity-60 hover:text-primary hover:opacity-100 transition-all duration-300 font-bold"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 md:py-12 border-t border-[var(--border-color)] flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[8px] md:text-[10px] uppercase tracking-widest opacity-40 font-bold text-center md:text-left">
            <DecryptedText
              text={`© ${year} ÁGAPE SOLUTIONS. TODOS OS DIREITOS RESERVADOS.`}
              speed={28}
              maxIterations={6}
              sequential
              revealDirection="start"
              className="text-primary"
              encryptedClassName="opacity-40"
            />
          </p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            <a href="#" className="text-[8px] md:text-[10px] uppercase tracking-widest opacity-20 hover:opacity-100 transition-all font-bold">Política de Privacidade</a>
            <a href="#" className="text-[8px] md:text-[10px] uppercase tracking-widest opacity-20 hover:opacity-100 transition-all font-bold">Termos de Uso</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
