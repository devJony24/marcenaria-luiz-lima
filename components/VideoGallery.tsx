"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export type VideoGalleryItem = {
  id: string;
  title: string;
  description?: string;
  thumbnail: string;
  file: string;
  duration: string;
};

type VideoGalleryProps = {
  items: VideoGalleryItem[];
};

export function VideoGallery({ items }: VideoGalleryProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeItem = items.find((item) => item.id === activeId) ?? null;

  useEffect(() => {
    if (!activeItem) return;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveId(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeItem]);

  return (
    <section className="section video-gallery" aria-labelledby="video-gallery-title">
      <div className="container">
        <div className="video-gallery-heading reveal">
          <span className="eyebrow">Trabalhos em movimento</span>
          <h2 id="video-gallery-title">Veja alguns trabalhos em vídeo</h2>
          <p>Conheça um pouco mais da qualidade dos nossos serviços através de uma apresentação rápida.</p>
        </div>

        <div className="video-grid" aria-label="Galeria de vídeos">
          {items.map((item) => (
            <article className="video-card reveal" key={item.id}>
              <div className="video-media">
                <button
                  className="video-thumbnail"
                  type="button"
                  onClick={() => setActiveId(item.id)}
                  data-video-src={item.file}
                  data-video-poster={item.thumbnail}
                  data-video-title={item.title}
                  aria-label={`Reproduzir ${item.title}`}
                >
                  <Image src={item.thumbnail} alt={`Capa do vídeo ${item.title}`} fill sizes="(max-width: 720px) 58vw, 220px" />
                  <span className="video-shade" />
                  <span className="play-button" aria-hidden="true"><i /></span>
                  <small>{item.duration}</small>
                </button>
              </div>
              <div className="video-card-copy">
                <h3>{item.title}</h3>
                {item.description && <p>{item.description}</p>}
              </div>
            </article>
          ))}
        </div>
      </div>

      {activeItem && (
        <div className="video-lightbox" role="dialog" aria-modal="true" aria-label={activeItem.title} onClick={() => setActiveId(null)}>
          <div className="video-lightbox-inner" onClick={(event) => event.stopPropagation()}>
            <button className="video-lightbox-close" type="button" onClick={() => setActiveId(null)} aria-label="Fechar vídeo">
              ×
            </button>
            <video
              controls
              autoPlay
              playsInline
              poster={activeItem.thumbnail}
              src={activeItem.file}
              aria-label={`${activeItem.title} — vídeo da Luiz Lima Marcenaria`}
            />
          </div>
        </div>
      )}
    </section>
  );
}
