"use client";

import { useEffect, useState } from "react";
import { ContactSelector } from "../components/ContactSelector";

const whatsapp =
  "https://wa.me/5548999999999?text=Olá%2C%20gostaria%20de%20solicitar%20um%20orçamento.";

const nav = [
  ["Home", "home"],
  ["Serviços", "servicos"],
  ["Projetos", "projetos"],
  ["Sobre", "sobre"],
  ["Contato", "contato"],
];

const services = [
  ["▦", "Fabricação de móveis", "Projetos sob medida que unem funcionalidade, proporção e acabamento cuidadoso."],
  ["⌑", "Montagem", "Montagem técnica e precisa para preservar cada detalhe do seu mobiliário."],
  ["↗", "Desmontagem", "Desmontagem organizada e segura para mudanças, reformas ou novos layouts."],
  ["◇", "Adaptações", "Ajustes inteligentes para fazer seus móveis funcionarem melhor no ambiente."],
  ["✦", "Reparos", "Correções pontuais que recuperam estrutura, alinhamento e aparência."],
  ["▣", "Instalação de TVs", "Fixação segura, nivelada e com atenção à estética do espaço."],
];

const differences = [
  ["01", "Atendimento rápido"],
  ["02", "Profissionalismo"],
  ["03", "Pontualidade"],
  ["04", "Organização"],
  ["05", "Qualidade"],
  ["06", "Acabamento"],
];

const faqs = [
  ["Atende toda Florianópolis?", "Sim. O atendimento é realizado em Florianópolis e a disponibilidade para cada região é confirmada no agendamento."],
  ["Como solicitar orçamento?", "Basta clicar em um dos botões de WhatsApp e enviar uma breve descrição, medidas e, se possível, fotos do serviço."],
  ["Vocês desmontam móveis para mudança?", "Sim. A desmontagem é feita de forma organizada, identificando as partes para facilitar a montagem no novo local."],
  ["Instalam qualquer modelo de TV?", "Atendemos diferentes tamanhos e modelos, sempre avaliando a parede, o suporte e as condições para uma fixação segura."],
  ["Fazem fabricação sob medida?", "Sim. Desenvolvemos móveis planejados conforme as medidas, a necessidade e o estilo de cada ambiente."],
];

function ImagePlaceholder({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div className={`placeholder ${className}`} aria-label={label}>
      <span className="placeholder-icon" aria-hidden="true">▧</span>
      <strong>{label}</strong>
      <small>Imagem será adicionada futuramente</small>
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="section-heading reveal">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        }),
      { threshold: 0.12 },
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <header className={scrolled ? "site-header scrolled" : "site-header"}>
        <div className="nav-wrap">
          <a className="brand" href="#home" aria-label="Luiz Lima Móveis, início">
            <span className="brand-mark">LL</span>
            <span>LUIZ LIMA <small>MÓVEIS</small></span>
          </a>
          <nav className={menuOpen ? "main-nav open" : "main-nav"} aria-label="Navegação principal">
            {nav.map(([label, id]) => (
              <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a>
            ))}
            <a className="button button-small mobile-cta" href={whatsapp} target="_blank" rel="noreferrer">
              Solicitar orçamento
            </a>
          </nav>
          <a className="button button-small desktop-cta" href={whatsapp} target="_blank" rel="noreferrer">
            Solicitar orçamento <span aria-hidden="true">↗</span>
          </a>
          <button
            className="menu-button"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span /><span />
          </button>
        </div>
      </header>

      <main id="conteudo">
        <section className="hero" id="home">
          <div className="container hero-grid">
            <div className="hero-copy reveal is-visible">
              <span className="eyebrow"><i /> Florianópolis e região</span>
              <h1>Móveis planejados, montagem e instalações com <em>acabamento profissional.</em></h1>
              <p>Mais de 10 anos atendendo Florianópolis com rapidez, qualidade e mais de 2.500 serviços realizados.</p>
              <div className="hero-actions">
                <a className="button hero-primary" href={whatsapp} target="_blank" rel="noreferrer">Solicitar orçamento pelo WhatsApp <span>↗</span></a>
                <a className="text-link" href={whatsapp} target="_blank" rel="noreferrer">
                  <span className="wa-icon">●</span> Falar no WhatsApp
                </a>
              </div>
              <div className="trust-line">
                <span className="avatars"><i>LL</i><i>+2k</i></span>
                <span><b>Excelência em cada detalhe</b><small>Atendimento próximo e profissional</small></span>
              </div>
            </div>
            <div className="hero-visual reveal is-visible">
              <div className="wood-accent" />
              <ImagePlaceholder label="Imagem Hero" className="hero-placeholder" />
              <div className="quality-tag"><span>✓</span><div><b>Acabamento profissional</b><small>Do projeto à instalação</small></div></div>
            </div>
          </div>
        </section>

        <section className="numbers" aria-label="Nossos números">
          <div className="container number-grid">
            {[
              ["◷", "2015", "Desde"],
              ["✦", "2.500+", "Atendimentos realizados"],
              ["⌖", "Florianópolis", "Atendimento local"],
              ["↗", "Rápido", "Agendamento facilitado"],
            ].map(([icon, value, label]) => (
              <article key={value} className="number-card reveal">
                <span>{icon}</span><div><strong>{value}</strong><small>{label}</small></div>
              </article>
            ))}
          </div>
        </section>

        <section className="section services" id="servicos">
          <div className="container">
            <SectionTitle eyebrow="O que fazemos" title="Soluções completas, do projeto à instalação." text="Cuidado técnico e atenção aos detalhes em cada etapa do seu ambiente." />
            <div className="service-grid">
              {services.map(([icon, title, text], index) => (
                <article className="service-card reveal" key={title}>
                  <div className="card-top"><span className="service-icon">{icon}</span><small>0{index + 1}</small></div>
                  <h3>{title}</h3><p>{text}</p>
                  <a href={whatsapp} target="_blank" rel="noreferrer" aria-label={`Solicitar orçamento para ${title}`}>Solicitar serviço <span>↗</span></a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section projects" id="projetos">
          <div className="container">
            <div className="projects-heading">
              <SectionTitle eyebrow="Projetos realizados" title="Qualidade que se percebe nos detalhes." text="Em breve, este espaço reunirá uma seleção de trabalhos realizados." />
              <a className="text-link" href={whatsapp} target="_blank" rel="noreferrer">Quero um projeto assim <span>↗</span></a>
            </div>
            <div className="project-grid">
              {Array.from({ length: 6 }, (_, index) => (
                <article className={`project-card reveal project-${index + 1}`} key={index}>
                  <ImagePlaceholder label="Imagem do Projeto" />
                  <div className="project-overlay"><span>Projeto 0{index + 1}</span><button type="button">Ver projeto ↗</button></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section process">
          <div className="container">
            <SectionTitle eyebrow="Como funciona" title="Simples para você. Bem executado por nós." />
            <div className="timeline">
              {[
                ["01", "Solicite um orçamento", "Conte o que você precisa e envie as principais informações."],
                ["02", "Agende o serviço", "Escolhemos juntos a melhor data para o atendimento."],
                ["03", "Execução profissional", "Realizamos o serviço com técnica, cuidado e organização."],
                ["04", "Entrega com qualidade", "Conferimos cada detalhe antes de finalizar a entrega."],
              ].map(([n, title, text]) => (
                <article className="step reveal" key={n}>
                  <span>{n}</span><h3>{title}</h3><p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section about" id="sobre">
          <div className="container about-grid">
            <div className="about-visual reveal">
              <ImagePlaceholder label="Foto do Luiz" />
              <div className="experience"><strong>10+</strong><span>anos de<br />experiência</span></div>
            </div>
            <div className="about-copy reveal">
              <span className="eyebrow">Sobre nós</span>
              <h2>Experiência que transforma ideias em ambientes bem resolvidos.</h2>
              <p>Desde 15 de outubro de 2015, a <strong>Luiz Lima Móveis</strong> atende Florianópolis com compromisso, proximidade e alto padrão de execução.</p>
              <p>São mais de 2.500 atendimentos em fabricação, montagem, desmontagem, adaptações, reparos e instalação de TVs — sempre com cuidado do início ao fim.</p>
              <div className="signature"><span>Luiz Lima</span><small>Marceneiro e fundador</small></div>
              <a className="button button-outline" href={whatsapp} target="_blank" rel="noreferrer">Conheça nosso trabalho <span>↗</span></a>
            </div>
          </div>
        </section>

        <section className="section differences">
          <div className="container">
            <SectionTitle eyebrow="Por que escolher" title="O cuidado que seu ambiente merece." />
            <div className="difference-grid">
              {differences.map(([n, label]) => (
                <article className="difference reveal" key={n}><small>{n}</small><span>✓</span><h3>{label}</h3></article>
              ))}
            </div>
          </div>
        </section>

        <section className="section testimonials">
          <div className="container">
            <SectionTitle eyebrow="Depoimentos" title="Confiança construída em cada atendimento." />
            <div className="testimonial-grid">
              {["Cliente 01", "Cliente 02", "Cliente 03"].map((client) => (
                <blockquote className="testimonial reveal" key={client}>
                  <div className="stars" aria-label="Avaliação ilustrativa">★★★★★</div>
                  <p>“Depoimento será inserido futuramente.”</p>
                  <footer><span>{client.slice(-2)}</span><div><b>{client}</b><small>Conteúdo ilustrativo</small></div></footer>
                </blockquote>
              ))}
            </div>
            <p className="placeholder-note">* Depoimentos exibidos como placeholders e serão substituídos por avaliações reais.</p>
          </div>
        </section>

        <section className="section faq">
          <div className="container faq-grid">
            <div className="faq-intro reveal">
              <span className="eyebrow">Perguntas frequentes</span>
              <h2>Tudo o que você precisa saber.</h2>
              <p>Não encontrou sua dúvida? Fale diretamente com a gente pelo WhatsApp.</p>
              <a className="text-link" href={whatsapp} target="_blank" rel="noreferrer">Falar com Luiz <span>↗</span></a>
            </div>
            <div className="accordion reveal">
              {faqs.map(([question, answer], index) => (
                <div className={openFaq === index ? "faq-item open" : "faq-item"} key={question}>
                  <button onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}>
                    <span>{question}</span><i>{openFaq === index ? "−" : "+"}</i>
                  </button>
                  <div className="faq-answer"><p>{answer}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ContactSelector whatsappUrl={whatsapp} />
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <a className="brand footer-brand" href="#home"><span className="brand-mark">LL</span><span>LUIZ LIMA <small>MÓVEIS</small></span></a>
            <p>Móveis planejados, montagem e instalações com acabamento profissional.</p>
          </div>
          <div><h3>Navegação</h3>{nav.slice(0, 4).map(([label, id]) => <a key={id} href={`#${id}`}>{label}</a>)}</div>
          <div><h3>Contato</h3><a href={whatsapp} target="_blank" rel="noreferrer">WhatsApp</a><a href="mailto:contato@luizlimamoveis.com.br">E-mail</a><span>Florianópolis — SC</span></div>
          <div>
            <h3>Endereço</h3>
            <a className="address-link" href="https://www.google.com/maps/search/?api=1&query=Rua+Fabriciano+Inácio+Monteiro+1112+Florianópolis" target="_blank" rel="noreferrer">
              <address>Rua Fabriciano Inácio Monteiro, 1112<br />Florianópolis — SC <span aria-hidden="true">↗</span></address>
            </a>
            <div className="socials">
              <span className="social-placeholder" aria-label="Instagram será adicionado futuramente">ig<small>em breve</small></span>
              <a href={whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp">wa</a>
            </div>
          </div>
        </div>
        <div className="container footer-bottom"><span>© {new Date().getFullYear()} Luiz Lima Móveis. Todos os direitos reservados.</span><span>Feito com precisão em Florianópolis.</span></div>
      </footer>
      <a className="floating-wa" href={whatsapp} target="_blank" rel="noreferrer" aria-label="Falar no WhatsApp">●<span>Orçamento</span></a>
    </>
  );
}
