"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ContactSelector } from "../components/ContactSelector";
import { VideoGallery, type VideoGalleryItem } from "../components/VideoGallery";

const whatsapp =
  "https://wa.me/554898307060?text=Olá%2C%20gostaria%20de%20solicitar%20um%20orçamento.";
const instagram =
  "https://www.instagram.com/luizlimamoveis?igsh=a2Vkc29mOXYzczQ4&utm_source=qr";

const whatsappForProject = (project: string) =>
  `https://wa.me/554898307060?text=${encodeURIComponent(`Olá! Vi o projeto ${project} no site e gostaria de um orçamento para algo semelhante.`)}`;

const videos: VideoGalleryItem[] = [
  {
    id: "projetos-recentes",
    title: "Projetos recentes",
    description: "Detalhes de cozinhas e ambientes planejados entregues com acabamento cuidadoso.",
    thumbnail: "/media/trabalhos-luiz-lima-poster.webp",
    file: "/media/trabalhos-luiz-lima.mp4",
    duration: "13 segundos",
  },
  {
    id: "apresentacao-servicos",
    title: "Marcenaria sob medida",
    description: "Uma apresentação dos serviços e das possibilidades para diferentes ambientes.",
    thumbnail: "/media/apresentacao-servicos-poster.webp",
    file: "/media/apresentacao-servicos-luiz-lima.mp4",
    duration: "32 segundos",
  },
];

const nav = [
  ["Home", "home"],
  ["Projetos", "projetos"],
  ["Contato", "contato"],
];

const differences = [
  ["01", "Atendimento rápido"],
  ["02", "Profissionalismo"],
  ["03", "Pontualidade"],
  ["04", "Organização"],
  ["05", "Qualidade"],
  ["06", "Acabamento"],
];

const projects = [
  {
    src: "/projects/armarios-comerciais-planejados.webp",
    alt: "Armários comerciais planejados e instalados em Florianópolis",
    label: "Marcenaria comercial",
    position: "center",
  },
  {
    src: "/projects/roupeiro-planejado-com-espelho.webp",
    alt: "Roupeiro planejado branco com portas de espelho",
    label: "Roupeiro planejado",
    position: "center 42%",
  },
  {
    src: "/projects/movel-planejado-sala-jantar.webp",
    alt: "Móvel planejado para sala de jantar com acabamento branco e madeira",
    label: "Sala de jantar",
    position: "center",
  },
  {
    src: "/projects/painel-tv-com-rack-sob-medida.webp",
    alt: "Painel de TV com rack de madeira feito sob medida",
    label: "Painel de TV",
    position: "center 44%",
  },
  {
    src: "/projects/cozinha-compacta-planejada.webp",
    alt: "Cozinha compacta planejada em azul e madeira",
    label: "Cozinha compacta",
    position: "center 42%",
  },
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
          <a className="brand" href="#home" aria-label="Luiz Lima Marcenaria, início">
            <Image src="/luiz-lima-logo.svg" alt="Luiz Lima — Marcenaria e Montagem de Móveis" width={430} height={92} priority />
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
              <p className="hero-stats">2.500+ atendimentos · desde 2015 · Florianópolis e região</p>
              <p className="hero-services">Fabricação · Montagem · Desmontagem · Adaptações · Reparos · TVs</p>
            </div>
            <div className="hero-visual reveal is-visible">
              <div className="wood-accent" />
              <div className="hero-media">
                <Image
                  src="/projects/cozinha-planejada-moderna.webp"
                  alt="Cozinha planejada moderna com acabamento em madeira e iluminação embutida"
                  fill
                  priority
                  sizes="(max-width: 980px) calc(100vw - 40px), 52vw"
                />
              </div>
              <div className="quality-tag"><span>✓</span><div><b>Acabamento profissional</b><small>Do projeto à instalação</small></div></div>
            </div>
          </div>
        </section>

        <section className="section projects" id="projetos">
          <div className="container">
            <div className="projects-heading">
              <SectionTitle eyebrow="Projetos realizados" title="Trabalhos entregues" text="Uma seleção de trabalhos realizados com técnica, cuidado e acabamento profissional." />
              <a className="text-link" href={whatsapp} target="_blank" rel="noreferrer">Quero um projeto assim <span>↗</span></a>
            </div>
            <div className="project-grid">
              {projects.map((project) => (
                <article className="project-card reveal" key={project.src}>
                  <Image
                    src={project.src}
                    alt={project.alt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 720px) calc(100vw - 32px), (max-width: 980px) 50vw, 33vw"
                    style={{ objectPosition: project.position }}
                  />
                  <div className="project-overlay">
                    <span>{project.label}</span>
                    <a className="project-action" href={whatsappForProject(project.label)} target="_blank" rel="noreferrer" aria-label={`Quero um projeto semelhante a ${project.label}`}>
                      Quero um projeto assim <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <VideoGallery items={videos} />

        {/*<section className="section differences">
          <div className="container">
            <SectionTitle eyebrow="Por que escolher" title="O cuidado que seu ambiente merece." />
            <div className="difference-grid">
              {differences.map(([n, label]) => (
                <article className="difference reveal" key={n}><small>{n}</small><span>✓</span><h3>{label}</h3></article>
              ))}
            </div>
          </div>
        </section>*/} 

        
        {/*<section className="section testimonials">
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
        </section>*/}

        <ContactSelector whatsappUrl={whatsapp} />
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <a className="brand footer-brand" href="#home"><Image src="/luiz-lima-logo.svg" alt="Luiz Lima — Marcenaria e Montagem de Móveis" width={430} height={92} /></a>
            <p>Luiz Lima na marcenaria desde 2015, em Florianópolis.</p>
          </div>
          <div><h3>Navegação</h3>{nav.map(([label, id]) => <a key={id} href={`#${id}`}>{label}</a>)}</div>
          <div>
            <h3>Siga</h3>
            <div className="socials">
              <a href={instagram} target="_blank" rel="noreferrer" aria-label="Instagram da Luiz Lima Marcenaria">ig</a>
              <a href={whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp">wa</a>
            </div>
          </div>
        </div>
        <div className="container footer-bottom"><span>© {new Date().getFullYear()} Luiz Lima Marcenaria. Todos os direitos reservados.</span><span>Feito com precisão em Florianópolis.</span></div>
      </footer>
      <a className="floating-wa" href={whatsapp} target="_blank" rel="noreferrer" aria-label="Falar no WhatsApp">●<span>Orçamento</span></a>
    </>
  );
}
