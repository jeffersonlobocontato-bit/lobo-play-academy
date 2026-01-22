import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle } from "lucide-react";

interface LeadCaptureFormProps {
  funnelId?: string;
  source?: string;
  onSuccess?: (leadId: string) => void;
  redirectUrl?: string;
  buttonText?: string;
  showPhone?: boolean;
  className?: string;
}

export const LeadCaptureForm = ({
  funnelId,
  source = "landing",
  onSuccess,
  redirectUrl,
  buttonText = "Quero Receber!",
  showPhone = false,
  className = "",
}: LeadCaptureFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  // Get UTM parameters from URL
  const getUtmParams = () => {
    const searchParams = new URLSearchParams(window.location.search);
    return {
      utm_source: searchParams.get("utm_source") || null,
      utm_medium: searchParams.get("utm_medium") || null,
      utm_campaign: searchParams.get("utm_campaign") || null,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha seu nome e email.",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        variant: "destructive",
        title: "Email inválido",
        description: "Por favor, insira um email válido.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const utmParams = getUtmParams();

      // Create lead
      const { data: lead, error } = await supabase
        .from("leads")
        .insert({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim() || null,
          source: source,
          ...utmParams,
        })
        .select()
        .single();

      if (error) {
        // Check if it's a duplicate email
        if (error.code === "23505") {
          // Still redirect - they're already in the system
          toast({
            title: "Você já está cadastrado!",
            description: "Redirecionando...",
          });
          
          // Get existing lead
          const { data: existingLead } = await supabase
            .from("leads")
            .select("id")
            .eq("email", formData.email.trim().toLowerCase())
            .single();
          
          if (existingLead && onSuccess) {
            onSuccess(existingLead.id);
          }
          
          if (redirectUrl) {
            setTimeout(() => {
              window.location.href = redirectUrl;
            }, 1000);
          }
          
          setIsSuccess(true);
          return;
        }
        throw error;
      }

      // Track lead event
      if (funnelId) {
        await supabase.from("lead_events").insert({
          lead_id: lead.id,
          funnel_id: funnelId,
          event_type: "capture",
          page_type: "landing",
          metadata: { source },
        });
      }

      setIsSuccess(true);
      
      toast({
        title: "Cadastro realizado! 🎉",
        description: "Você receberá as informações no seu email.",
      });

      if (onSuccess) {
        onSuccess(lead.id);
      }

      // Store lead_id in localStorage for later use
      localStorage.setItem("lobo_lead_id", lead.id);

      if (redirectUrl) {
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 1500);
      }
    } catch (error: any) {
      console.error("Error creating lead:", error);
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar",
        description: "Ocorreu um erro. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Cadastro realizado com sucesso!
        </h3>
        <p className="text-muted-foreground">
          {redirectUrl ? "Redirecionando..." : "Verifique seu email para mais informações."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <Label htmlFor="name" className="text-foreground">
          Seu nome
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="Como você quer ser chamado?"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          disabled={isLoading}
          className="bg-background border-border"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground">
          Seu melhor email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="email@exemplo.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          disabled={isLoading}
          className="bg-background border-border"
        />
      </div>

      {showPhone && (
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-foreground">
            WhatsApp (opcional)
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="(11) 99999-9999"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            disabled={isLoading}
            className="bg-background border-border"
          />
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full btn-glow font-semibold"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Cadastrando...
          </>
        ) : (
          buttonText
        )}
      </Button>
    </form>
  );
};
