import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const emailCorsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  template: "welcome" | "password-reset" | "course-access";
  data: Record<string, any>;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: emailCorsHeaders });
  }

  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  
  if (!resendApiKey) {
    console.error("RESEND_API_KEY not configured");
    return new Response(
      JSON.stringify({ error: "Email service not configured" }),
      { status: 500, headers: { ...emailCorsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const { to, template, data }: EmailRequest = await req.json();
    console.log(`Sending ${template} email to ${to}`);

    let subject: string;
    let html: string;

    switch (template) {
      case "welcome":
        subject = `🎉 Bem-vindo à LoboPlay, ${data.name}!`;
        html = getWelcomeTemplate(data);
        break;
      
      case "password-reset":
        subject = "🔐 Redefinir sua senha - LoboPlay";
        html = getPasswordResetTemplate(data);
        break;
      
      case "course-access":
        subject = `📚 Seu acesso ao curso está liberado!`;
        html = getCourseAccessTemplate(data);
        break;
      
      default:
        throw new Error(`Unknown template: ${template}`);
    }

    // Send email using Resend API directly
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "LoboPlay <onboarding@resend.dev>",
        to: [to],
        subject,
        html,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Resend error:", result);
      throw new Error(result.message || "Failed to send email");
    }

    console.log("Email sent successfully:", result);

    return new Response(
      JSON.stringify({ success: true, id: result?.id }),
      { status: 200, headers: { ...emailCorsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error sending email:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...emailCorsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function getWelcomeTemplate(data: Record<string, any>): string {
  const { name, isNewUser, tempPassword, loginUrl, productName } = data;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bem-vindo à LoboPlay</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0a0a0b;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" style="max-width: 600px; background: linear-gradient(135deg, #1a1a1b 0%, #0f0f10 100%); border-radius: 16px; border: 1px solid #27272a;">
          <tr>
            <td style="padding: 40px;">
              <!-- Header -->
              <div style="text-align: center; margin-bottom: 32px;">
                <h1 style="color: #f59e0b; font-size: 32px; font-weight: 700; margin: 0;">🐺 LoboPlay</h1>
              </div>
              
              <!-- Content -->
              <h2 style="color: #ffffff; font-size: 24px; margin-bottom: 16px;">
                Olá, ${name}! 🎉
              </h2>
              
              <p style="color: #a1a1aa; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                Sua compra de <strong style="color: #f59e0b;">${productName || "nosso curso"}</strong> foi confirmada com sucesso!
              </p>
              
              ${isNewUser ? `
              <div style="background-color: #18181b; border-radius: 12px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #f59e0b;">
                <p style="color: #ffffff; font-size: 16px; margin: 0 0 12px 0; font-weight: 600;">
                  🔐 Seus dados de acesso:
                </p>
                <p style="color: #a1a1aa; font-size: 14px; margin: 0 0 8px 0;">
                  <strong style="color: #ffffff;">Email:</strong> ${data.email || "seu email de compra"}
                </p>
                <p style="color: #a1a1aa; font-size: 14px; margin: 0;">
                  <strong style="color: #ffffff;">Senha temporária:</strong> 
                  <code style="background: #27272a; padding: 4px 8px; border-radius: 4px; color: #f59e0b;">${tempPassword}</code>
                </p>
                <p style="color: #71717a; font-size: 12px; margin: 16px 0 0 0;">
                  ⚠️ Recomendamos alterar sua senha após o primeiro acesso.
                </p>
              </div>
              ` : `
              <p style="color: #a1a1aa; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                O curso já está disponível na sua conta. Use suas credenciais existentes para acessar.
              </p>
              `}
              
              <!-- CTA Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${loginUrl}" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #000000; font-size: 16px; font-weight: 600; padding: 16px 32px; border-radius: 8px; text-decoration: none;">
                  Acessar Meus Cursos →
                </a>
              </div>
              
              <p style="color: #71717a; font-size: 14px; line-height: 1.6; text-align: center;">
                Se tiver qualquer dúvida, responda este email que teremos prazer em ajudar!
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; border-top: 1px solid #27272a;">
              <p style="color: #52525b; font-size: 12px; text-align: center; margin: 0;">
                © ${new Date().getFullYear()} LoboPlay. Todos os direitos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

function getPasswordResetTemplate(data: Record<string, any>): string {
  const { name, resetUrl } = data;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0a0a0b;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" style="max-width: 600px; background: #1a1a1b; border-radius: 16px; border: 1px solid #27272a;">
          <tr>
            <td style="padding: 40px;">
              <div style="text-align: center; margin-bottom: 32px;">
                <h1 style="color: #f59e0b; font-size: 32px; margin: 0;">🐺 LoboPlay</h1>
              </div>
              
              <h2 style="color: #ffffff; font-size: 24px; margin-bottom: 16px;">
                Redefinir senha
              </h2>
              
              <p style="color: #a1a1aa; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                Olá${name ? `, ${name}` : ""}! Recebemos uma solicitação para redefinir sua senha.
              </p>
              
              <div style="text-align: center; margin: 32px 0;">
                <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #000000; font-size: 16px; font-weight: 600; padding: 16px 32px; border-radius: 8px; text-decoration: none;">
                  Redefinir Senha →
                </a>
              </div>
              
              <p style="color: #71717a; font-size: 14px; line-height: 1.6;">
                Se você não solicitou esta redefinição, ignore este email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

function getCourseAccessTemplate(data: Record<string, any>): string {
  const { name, courseName, courseUrl } = data;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0a0a0b;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" style="max-width: 600px; background: #1a1a1b; border-radius: 16px; border: 1px solid #27272a;">
          <tr>
            <td style="padding: 40px;">
              <div style="text-align: center; margin-bottom: 32px;">
                <h1 style="color: #f59e0b; font-size: 32px; margin: 0;">🐺 LoboPlay</h1>
              </div>
              
              <h2 style="color: #ffffff; font-size: 24px; margin-bottom: 16px;">
                🎓 Novo curso liberado!
              </h2>
              
              <p style="color: #a1a1aa; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                Olá, ${name}! Seu acesso ao curso <strong style="color: #f59e0b;">${courseName}</strong> foi liberado.
              </p>
              
              <div style="text-align: center; margin: 32px 0;">
                <a href="${courseUrl}" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #000000; font-size: 16px; font-weight: 600; padding: 16px 32px; border-radius: 8px; text-decoration: none;">
                  Começar a Estudar →
                </a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
