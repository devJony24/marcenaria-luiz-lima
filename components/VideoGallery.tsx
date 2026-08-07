"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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
  const videoRefs = useRef(new Map<string, HTMLVideoElement>());

  useEffect(() => {
    videoRefs.current.forEach((video, id) => {
      if (id !== activeId) video.pause();
    });

    if (!activeId) return;
    const activeVideo = videoRefs.current.get(activeId);
    if (!activeVideo) return;
    activeVideo.load();
    void activeVideo.play().catch(() => undefined);
  }, [activeId]);

  return (
    <section className="section video-gallery" aria-labelledby="video-gallery-title">
      <div className="container">
        <div className="video-gallery-heading reveal">
          <span className="eyebrow">Trabalhos em movimento</span>
          <h2 id="video-gallery-title">Veja alguns trabalhos em vídeo</h2>
          <p>Conheça um pouco mais da qualidade dos nossos serviços através de uma apresentação rápida.</p>
        </div>

        <div className="video-grid" aria-label="Galeria de vídeos">
          {items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <article className="video-card reveal" key={item.id}>
                <div className={isActive ? "video-media is-playing" : "video-media"}>
                  {isActive ? (
                    <video
                      ref={(element) => {
                        if (element) videoRefs.current.set(item.id, element);
                        else videoRefs.current.delete(item.id);
                      }}
                      controls
                      playsInline
                      preload="metadata"
                      poster={item.thumbnail}
                      src={item.file}
                      data-video-id={item.id}
                      aria-label={`${item.title} — vídeo da Luiz Lima Marcenaria`}
                    />
                  ) : (
                    <button
                      className="video-thumbnail"
                      type="button"
                      onClick={() => setActiveId(item.id)}
                      data-video-src={item.file}
                      data-video-poster={item.thumbnail}
                      data-video-title={item.title}
                      aria-label={`Reproduzir ${item.title}`}
                    >
                      <Image src={item.thumbnail} alt={`Capa do vídeo ${item.title}`} fill sizes="(max-width: 720px) 84vw, 50vw" />
                      <span className="video-shade" />
                      <span className="play-button" aria-hidden="true"><i /></span>
                      <small>{item.duration}</small>
                    </button>
                  )}
                </div>
                <div className="video-card-copy">
                  <h3>{item.title}</h3>
                  {item.description && <p>{item.description}</p>}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
