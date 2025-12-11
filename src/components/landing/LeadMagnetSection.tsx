import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Mail, Check, Loader2, FileText, Brain, Target, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

export const LeadMagnetSection = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !name) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todos os campos.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsLoading(false);
    setIsSuccess(true);
    
    toast({
      title: 'E-book enviado!',
      description: 'Verifique sua caixa de entrada para acessar o Guia de Extração.',
    });
  };

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-lobo-slate/10" />
      <div className="absolute inset-0 bg-hero-pattern opacity-50" />
      
      <div className="container-tight relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="card-glass rounded-3xl p-8 md:p-12 lg:p-16 border-2 border-primary/30"
          >
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              {/* Content */}
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 mb-6">
                  <Download className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-green-400">100% Gratuito</span>
                </div>

                <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
                  <span className="text-gradient">Guia de Extração</span>{' '}
                  Sintática, Semântica e Lexical
                </h2>

                <p className="text-muted-foreground text-lg mb-6">
                  Receba gratuitamente o guia que introduz os fundamentos da análise linguística 
                  aplicada à criação de agentes de IA. O primeiro passo para dominar o DNA autoral!
                </p>

                <ul className="space-y-4">
                  {[
                    { icon: Brain, text: 'Fundamentos de análise sintática para IA' },
                    { icon: Target, text: 'Como extrair padrões semânticos de textos' },
                    { icon: FileText, text: 'Mapeamento lexical simplificado' },
                    { icon: Sparkles, text: 'Primeiros passos para criar DNA autoral' },
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3 text-muted-foreground">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-4 h-4 text-primary" />
                      </div>
                      {item.text}
                    </li>
                  ))}
                </ul>

                {/* Micro-commitment */}
                <div className="mt-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                  <p className="text-sm text-yellow-400">
                    💡 <strong>Dica:</strong> Este guia é o aperitivo. O curso completo do Método DEL 
                    vai te mostrar como aplicar tudo isso na prática para criar SuperAgentes!
                  </p>
                </div>
              </div>

              {/* Form */}
              <div className="bg-secondary/30 rounded-2xl p-6 md:p-8">
                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                      <Check className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="font-heading font-bold text-2xl mb-2">Pronto!</h3>
                    <p className="text-muted-foreground mb-6">
                      Enviamos o Guia de Extração para o seu e-mail. Verifique sua caixa de entrada!
                    </p>
                    <a 
                      href="https://hotmart.com/pt-br/marketplace/produtos/o-codigo-invisivel-dos-superagentes-de-inteligencia-artificial/O101044688E" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Button variant="hero" size="lg">
                        Quero o Curso Completo por R$14
                      </Button>
                    </a>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-heading font-bold text-xl">
                        Receba o Guia Grátis
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Preencha seus dados para download imediato
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Seu nome
                      </label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Como posso te chamar?"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-background/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Seu melhor e-mail
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="email@exemplo.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 bg-background/50"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      variant="hero"
                      size="lg"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5" />
                          Baixar Guia Gratuito
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      🔒 Seus dados estão seguros. Não enviamos spam.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LeadMagnetSection;