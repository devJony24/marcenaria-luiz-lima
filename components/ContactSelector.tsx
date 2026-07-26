"use client";

import { useRef, useState } from "react";
import { ContactForm } from "./ContactForm";

type ContactSelectorProps = {
  whatsappUrl: string;
};

export function ContactSelector({ whatsappUrl }: ContactSelectorProps) {
  const [showForm, setShowForm] = useState(false);
  const formRegionRef = useRef<HTMLDivElement>(null);

  const openForm = () => {
    setShowForm(true);
    window.setTimeout(() => {
      formRegionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      formRegionRef.current?.querySelector<HTMLInputElement>("input")?.focus({
        preventScroll: true,
      });
    }, 180);
  };

  return (
    <section className="contact-choice" id="contato">
      <div className="container">
        <div className="contact-choice-heading reveal">
          <span className="eyebrow">Contato</span>
          <h2>Como você prefere falar conosco?</h2>
          <p>Escolha a forma mais confortável para iniciar seu atendimento.</p>
        </div>

        <div className="channel-grid">
          <article className="channel-card channel-whatsapp reveal">
            <span className="channel-icon" aria-hidden="true">●</span>
            <div>
              <h3>WhatsApp</h3>
              <p>Converse diretamente conosco e receba um atendimento rápido.</p>
            </div>
            <a className="button" href={whatsappUrl} target="_blank" rel="noreferrer">
              Falar no WhatsApp <span aria-hidden="true">↗</span>
            </a>
          </article>

          <article className={`channel-card channel-form reveal${showForm ? " selected" : ""}`}>
            <span className="channel-icon mail-icon" aria-hidden="true">✉</span>
            <div>
              <h3>Solicitar orçamento</h3>
              <p>Conte um pouco sobre seu projeto para prepararmos um atendimento personalizado.</p>
            </div>
            <button
              className="button button-outline"
              type="button"
              onClick={openForm}
              aria-expanded={showForm}
              aria-controls="contact-form-region"
            >
              {showForm ? "Formulário aberto" : "Preencher formulário"}
              <span aria-hidden="true">{showForm ? "↓" : "↘"}</span>
            </button>
          </article>
        </div>

        <div
          id="contact-form-region"
          ref={formRegionRef}
          className={`form-reveal${showForm ? " open" : ""}`}
          aria-hidden={!showForm}
        >
          <div className="contact-card">
            <div className="contact-card-heading">
              <div>
                <span>Solicitação de orçamento</span>
                <p>Preencha os dados abaixo para iniciar seu atendimento.</p>
              </div>
              <small>Campos com * são obrigatórios</small>
            </div>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
