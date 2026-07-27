"use client";

type ContactSelectorProps = {
  whatsappUrl: string;
};

const contactItems = [
  { label: "Telefone", value: "(48) 99999-9999", href: "tel:+5548999999999" },
  { label: "WhatsApp", value: "(48) 99999-9999", href: null },
  { label: "E-mail", value: "contato@luizlimamoveis.com.br", href: "mailto:contato@luizlimamoveis.com.br" },
  { label: "Instagram", value: "@luizlimamarcenaria · em breve", href: null },
  {
    label: "Endereço",
    value: "Rua Fabriciano Inácio Monteiro, 1112 — Florianópolis",
    href: "https://www.google.com/maps/search/?api=1&query=Rua+Fabriciano+Inácio+Monteiro+1112+Florianópolis",
  },
];

export function ContactSelector({ whatsappUrl }: ContactSelectorProps) {
  return (
    <section className="contact-choice" id="contato">
      <div className="container contact-single reveal">
        <div className="contact-main">
          <span className="eyebrow">Contato</span>
          <h2>Vamos conversar<br />sobre seu projeto.</h2>
          <p>Conte o que você precisa e receba um atendimento próximo, rápido e profissional para transformar sua ideia em um ambiente bem resolvido.</p>
          <a className="button whatsapp-primary" href={whatsappUrl} target="_blank" rel="noreferrer">
            <span className="whatsapp-mark" aria-hidden="true">●</span>
            Falar pelo WhatsApp
            <span aria-hidden="true">↗</span>
          </a>
          <small className="response-time"><span aria-hidden="true">✓</span> Respondemos o mais breve possível.</small>
        </div>

        <div className="contact-details" aria-label="Informações de contato">
          <div className="contact-details-heading">
            <span>Outros canais</span>
            <small>Informações de contato</small>
          </div>
          <dl>
            {contactItems.map((item) => (
              <div className="contact-detail" key={item.label}>
                <dt>{item.label}</dt>
                <dd>
                  {item.href ? (
                    <a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel={item.href.startsWith("http") ? "noreferrer" : undefined}>
                      {item.value} <span aria-hidden="true">↗</span>
                    </a>
                  ) : item.label === "WhatsApp" ? (
                    <a href={whatsappUrl} target="_blank" rel="noreferrer">{item.value} <span aria-hidden="true">↗</span></a>
                  ) : (
                    <span>{item.value}</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
