"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type VideoShowcaseProps = {
  poster: string;
  videoSrc: string;
};

export function VideoShowcase({ poster, videoSrc }: VideoShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inViewport, setInViewport] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "180px 0px" },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || !videoRef.current) return;
    videoRef.current.load();
    void videoRef.current.play().catch(() => undefined);
  }, [playing]);

  return (
    <section className="section video-showcase" ref={sectionRef} aria-labelledby="video-title">
      <div className="container video-layout">
        <div className="video-copy reveal">
          <span className="eyebrow">Trabalhos em movimento</span>
          <h2 id="video-title">Veja alguns trabalhos em vídeo</h2>
          <p>Conheça um pouco mais da qualidade dos nossos serviços através de uma apresentação rápida.</p>
        </div>

        <div className="video-stage reveal">
          <div className={playing ? "video-frame is-playing" : "video-frame"}>
            <video
              ref={videoRef}
              controls={playing}
              playsInline
              preload={inViewport ? "metadata" : "none"}
              poster={poster}
              src={inViewport || playing ? videoSrc : undefined}
              data-video-src={videoSrc}
              aria-label="Apresentação em vídeo de trabalhos realizados pela Luiz Lima Marcenaria"
            />
            {!playing && (
              <button className="video-cover" type="button" onClick={() => setPlaying(true)} aria-label="Reproduzir vídeo dos trabalhos realizados">
                <Image src={poster} alt="Cozinha planejada em madeira e azul, capa do vídeo de projetos" fill sizes="(max-width: 720px) calc(100vw - 48px), 430px" />
                <span className="video-shade" />
                <span className="play-button" aria-hidden="true"><i /></span>
                <small>Assistir apresentação</small>
              </button>
            )}
          </div>
          <span className="video-duration">Apresentação rápida · 13 segundos</span>
        </div>
      </div>
    </section>
  );
}
