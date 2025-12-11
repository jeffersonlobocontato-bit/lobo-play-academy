import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoboPlayLogo from '@/components/LoboPlayLogo';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { label: 'Cursos', href: '/cursos' },
  { label: 'Sobre', href: '/#sobre' },
  { label: 'Depoimentos', href: '/#depoimentos' },
  { label: 'Contato', href: '/#contato' },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <nav className="container-tight">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="relative z-10">
            <LoboPlayLogo className="h-10 md:h-12" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.href} to={item.href}>
                <Button variant="nav" size="sm">
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                <User className="w-4 h-4 mr-1" />
                Entrar
              </Button>
            </Link>
            <Link to="/cursos">
              <Button variant="hero" size="default">
                Começar Agora
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden relative z-10 p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2 border-t border-border/50">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="block px-4 py-3 text-foreground/80 hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="pt-4 px-4 space-y-3">
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Entrar
                    </Button>
                  </Link>
                  <Link to="/cursos" onClick={() => setIsOpen(false)}>
                    <Button variant="hero" className="w-full">
                      Começar Agora
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Navbar;
