import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Loader2, MessageCircle } from 'lucide-react';

export default function Form() {
  const formRef = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // INTEGRAÇÃO COM EMAILJS (Coloque seu código de envio aqui)
    // Exemplo: emailjs.sendForm('SERVICE_ID', 'TEMPLATE_ID', formRef.current, 'PUBLIC_KEY')

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      formRef.current.reset();
      setTimeout(() => setIsSuccess(false), 5000);
    }, 2000);
  };

  // CONFIGURAÇÕES DO FORMULÁRIO (Labels, Placeholders e Nomes)
  const fields = [
    { name: 'user_name', type: 'text', placeholder: 'Nome Completo', label: 'Quem é você?' },
    { name: 'user_email', type: 'email', placeholder: 'email@empresa.com', label: 'E-mail Corporativo' },
    { name: 'company', type: 'text', placeholder: 'Nome da Organização', label: 'Sua Empresa' },
  ];

  // CONFIGURAÇÕES DO WHATSAPP
  const whatsappConfig = {
    phone: '5500000000000', // Substitua pelo número real (DDI + DDD + Número)
    message: 'Olá! Gostaria de iniciar uma consultoria estratégica.' // Mensagem automática inicial
  };

  const whatsappUrl = `https://wa.me/${whatsappConfig.phone}?text=${encodeURIComponent(whatsappConfig.message)}`;

  return (
    <section id="contact" className="py-20 md:py-40 bg-transparent text-[var(--text-color)] relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 lg:gap-24 items-center">

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {/* TEXTOS DA SEÇÃO DE CONTATO */}
            <span className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.5em] text-primary mb-6 md:mb-8 block">Contato Estratégico</span>
            <h2 className="text-5xl md:text-8xl font-heading font-black leading-[0.85] tracking-tighter mb-8 md:mb-12">
              Pronto para <br />
              <span className="text-primary italic">Escalar?</span>
            </h2>
            <p className="text-lg md:text-xl opacity-60 leading-relaxed max-w-md mb-8 md:mb-12">
              Inicie uma conversa técnica sobre seu próximo grande desafio. Nossa equipe sênior está pronta para analisar sua demanda.
            </p>

            <div className="space-y-4 md:space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <CheckCircle2 size={20} md:size={24} />
                </div>
                <span className="font-bold text-base md:text-lg">Análise técnica em 24h</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <CheckCircle2 size={20} md:size={24} />
                </div>
                <span className="font-bold text-base md:text-lg">Acordo de Confidencialidade (NDA)</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-6 md:p-8 border border-[var(--border-color)] bg-primary/[0.02] rounded-[2rem] md:rounded-[2.5rem] max-w-lg w-full lg:ml-auto"
          >
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
              {fields.map((field) => (
                <div key={field.name} className="relative group">
                  <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-primary mb-2 block">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    required
                    placeholder={field.placeholder}
                    className="w-full bg-transparent border-b border-[var(--border-color)] py-2 md:py-3 text-base md:text-lg font-bold focus:outline-none focus:border-primary transition-colors placeholder:opacity-20"
                  />
                </div>
              ))}

              <div className="relative group">
                <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-primary mb-2 block">
                  Mensagem
                </label>
                <textarea
                  name="message"
                  rows="3"
                  placeholder="Conte-nos sobre seu projeto..."
                  className="w-full bg-transparent border-b border-[var(--border-color)] py-2 md:py-3 text-base md:text-lg font-bold focus:outline-none focus:border-primary transition-colors placeholder:opacity-20 resize-none"
                />
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting || isSuccess}
                  className="w-fit flex items-center gap-6 px-10 md:px-14 py-4 md:py-5 bg-primary text-white font-black text-[10px] md:text-xs uppercase tracking-[0.3em] rounded-full hover:bg-opacity-90 transition-all disabled:opacity-50 mb-4"
                >
                  <span>
                    {isSubmitting ? 'Enviando...' : isSuccess ? 'Mensagem Enviada' : 'Iniciar Consultoria'}
                  </span>
                  {isSubmitting ? <Loader2 size={16} md:size={18} className="animate-spin" /> : isSuccess ? <CheckCircle2 size={16} md:size={18} /> : <ArrowRight size={16} md:size={18} />}
                </button>
              </div>

              <div className="py-2">
                <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest opacity-30 mb-4 text-center">Conexão Imediata</p>
                <div className="flex justify-center">
                  <motion.a
                    href={whatsappUrl} // URL gerada automaticamente pelas configurações acima
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -2, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-fit flex items-center justify-center gap-3 px-8 md:px-12 py-4 border border-primary/20 bg-primary/[0.03] hover:bg-primary/10 text-primary font-black text-[10px] md:text-xs uppercase tracking-[0.3em] rounded-full transition-all group"
                  >
                    <MessageCircle size={16} md:size={18} className="group-hover:rotate-12 transition-transform" />
                    <span>Falar via WhatsApp</span>
                  </motion.a>
                </div>
              </div>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
