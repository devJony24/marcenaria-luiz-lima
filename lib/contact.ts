export type ContactPayload = {
  name: string;
  phone: string;
  email?: string;
  message: string;
};

export type ContactResult = {
  success: true;
  message: string;
};

const WHATSAPP_NUMBER = "5548999999999";

function createWhatsAppMessage(data: ContactPayload) {
  const lines = [
    "Olá, gostaria de solicitar um orçamento.",
    "",
    `Nome: ${data.name}`,
    `Telefone: ${data.phone}`,
    data.email ? `E-mail: ${data.email}` : null,
    "",
    `Mensagem: ${data.message}`,
  ].filter(Boolean);

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}

/**
 * Provider de contato.
 * Troque somente esta função ao integrar EmailJS, Resend, n8n, CRM ou Sheets.
 */
export async function submitContact(data: ContactPayload): Promise<ContactResult> {
  const whatsappWindow =
    typeof window !== "undefined" ? window.open("about:blank", "_blank") : null;
  if (whatsappWindow) whatsappWindow.opener = null;

  await new Promise((resolve) => setTimeout(resolve, 650));

  const destination = createWhatsAppMessage(data);
  if (whatsappWindow) {
    whatsappWindow.location.href = destination;
  } else if (typeof window !== "undefined") {
    window.location.href = destination;
  }

  return {
    success: true,
    message: "Tudo certo! Preparamos sua solicitação e abrimos o WhatsApp para você enviar.",
  };
}
