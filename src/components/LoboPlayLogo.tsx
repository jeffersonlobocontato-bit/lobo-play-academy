interface LoboPlayLogoProps {
  variant?: 'horizontal' | 'icon';
  className?: string;
}

export const LoboPlayLogo = ({ 
  variant = 'horizontal',
  className = 'h-12 w-auto'
}: LoboPlayLogoProps) => {
  const isHorizontal = variant === 'horizontal';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Ícone do Lobo */}
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto aspect-square"
      >
        {/* Orelha e Testa (Dark Blue) */}
        <path d="M45 5 L65 30 L50 50 L35 25 Z" fill="#0F172A"/>
        {/* Focinho e Face (Graphite/Slate) */}
        <path d="M65 30 L95 55 L70 75 L50 50 Z" fill="#334155"/>
        {/* Juba/Nuca (Dark Blue) */}
        <path d="M35 25 L50 50 L45 80 L15 65 L20 40 Z" fill="#0F172A"/>
        {/* Sombra do Pescoço (Darkest) */}
        <path d="M45 80 L70 75 L50 95 L35 85 Z" fill="#1E293B"/>
        {/* Olho (Orange Accent) */}
        <path d="M58 38 L72 42 L60 46 Z" fill="#FF8C00"/>
      </svg>

      {/* Texto (Apenas para versão Horizontal) */}
      {isHorizontal && (
        <div className="flex flex-col justify-center h-full">
          <span className="font-heading font-extrabold tracking-tight text-foreground leading-none text-2xl">
            LOBO<span className="text-primary">PLAY</span>
          </span>
        </div>
      )}
    </div>
  );
};

export default LoboPlayLogo;
