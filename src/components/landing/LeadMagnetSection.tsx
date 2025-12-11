import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Mail, Check, Loader2 } from 'lucide-react';
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
      description: 'Verifique sua caixa de entrada para acessar o material.',
    });
  };

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-lobo-slate/10" />
      <div className="absolute inset-0 bg-hero-pattern opacity-50" />
      
      <div className="container-tight relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="card-glass rounded-3xl p-8 md:p-12 lg:p-16"
          >
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              {/* Content */}
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
                  <Download className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Material Gratuito</span>
                </div>

                <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
                  Baixe Grátis:{' '}
                  <span className="text-gradient">Guia Completo</span>{' '}
                  para Iniciar sua Carreira
                </h2>

                <p className="text-muted-foreground text-lg mb-6">
                  Receba nosso e-book exclusivo com as melhores estratégias para 
                  alavancar sua carreira profissional. 100% gratuito!
                </p>

                <ul className="space-y-3">
                  {[
                    'Como escolher a área certa para você',
                    'Estratégias de aprendizado acelerado',
                    'Dicas para se destacar no mercado',
                    'Roadmap completo de estudos',
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3 text-muted-foreground">
                      <Check className="w-5 h-5 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
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
                    <p className="text-muted-foreground">
                      Enviamos o e-book para o seu e-mail. Verifique sua caixa de entrada!
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="font-heading font-bold text-xl mb-6 text-center">
                      Receba seu E-book Grátis
                    </h3>

                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Seu nome
                      </label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Digite seu nome"
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
                          placeholder="seuemail@exemplo.com"
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
                          Baixar E-book Grátis
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      Ao se cadastrar, você concorda com nossa{' '}
                      <a href="/privacidade" className="text-primary hover:underline">
                        Política de Privacidade
                      </a>
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
