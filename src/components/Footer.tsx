import { Link } from 'react-router-dom';
import { Mail, Instagram, Youtube, Linkedin, Brain } from 'lucide-react';
import LoboPlayLogo from '@/components/LoboPlayLogo';

const footerLinks = {
  platform: [
    { label: 'Curso de IA', href: '/#cursos' },
    { label: 'Método DEL', href: '/#sobre' },
    { label: 'Depoimentos', href: '/#depoimentos' },
    { label: 'E-book Grátis', href: '/#lead-magnet' },
  ],
  support: [
    { label: 'Contato', href: '/#contato' },
    { label: 'WhatsApp', href: 'https://wa.me/5511999999999' },
    { label: 'FAQ', href: '/#faq' },
  ],
  legal: [
    { label: 'Termos de Uso', href: '/termos' },
    { label: 'Política de Privacidade', href: '/privacidade' },
  ],
};

const socialLinks = [
  { icon: Instagram, href: 'https://instagram.com/loboplay', label: 'Instagram' },
  { icon: Youtube, href: 'https://youtube.com/loboplay', label: 'YouTube' },
  { icon: Linkedin, href: 'https://linkedin.com/company/loboplay', label: 'LinkedIn' },
];

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container-tight section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-6">
            <LoboPlayLogo className="h-10" />
            <p className="text-muted-foreground max-w-sm">
              Cursos de Inteligência Artificial com foco em autenticidade. 
              Aprenda a criar agentes de IA com DNA autoral usando o exclusivo Método DEL.
            </p>
            <div className="space-y-3">
              <a href="mailto:contato@loboplay.com" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="w-5 h-5 text-primary" />
                contato@loboplay.com
              </a>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Brain className="w-5 h-5 text-primary" />
                Especialista em IA com DNA Autoral
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">Plataforma</h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">Suporte</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  {link.href.startsWith('http') ? (
                    <a 
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link 
                      to={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} LoboPlay. Todos os direitos reservados. 
            <span className="text-primary ml-2">Método DEL por Jefferson Lobo</span>
          </p>
          
          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;