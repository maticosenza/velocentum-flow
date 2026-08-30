import { useEffect, useRef, useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import type MuxPlayerElement from "@mux/mux-player";
import { Marquee } from "@/components/Marquee";

type Trabajo = {
  playbackId: string;
  categoria: string;
  accion: string;
};

// Order and pairing as handed off; NOT verified against the source clips
// beyond the poster-vs-categoria spot check called out in the PR/report.
const TRABAJOS: Trabajo[] = [
  {
    playbackId: "8OWtx2015Wnb4lVUrdUTcmlOut012eF01Ow6101SvCFCpp00",
    categoria: "Real Estate",
    accion: "Street view",
  },
  {
    playbackId: "wrEK01FS5IbT8vZoHvI01GmE3PNW6T4102015kJmkYoeE5M",
    categoria: "Comunidad",
    accion: "Community",
  },
  {
    playbackId: "m01SeXZqyxO52dcJizZ9YewIvCTRqgjVr01cDTPGqGBdI",
    categoria: "Moda",
    accion: "Shooting",
  },
  {
    playbackId: "MTh4WGi56iyuTbz02R3yl35NgQFFPX5BC9E1hRQvvW6I",
    categoria: "Real Estate",
    accion: "Shooting",
  },
  {
    playbackId: "xJnV2BBC5mPe5d2gH84R35I66BsBaWDrLv7L00e1Nphg",
    categoria: "Moda",
    accion: "Streetwear",
  },
  {
    playbackId: "LT4sb02KSWpWpTBs6NfZSKuBZ021v4MaRD01vHwxeDmfVc",
    categoria: "Indumentaria",
    accion: "Fashion shoot",
  },
  {
    playbackId: "01PQEsr5w6BBXc3tiIyogm8C3tclewtuAJm00A7AVQLW8",
    categoria: "Comunidad",
    accion: "Merchandising",
  },
  {
    playbackId: "Bb1mX5a02y02OLdieay0168UUaz6ExBRyMlAYsw0100eROG8",
    categoria: "Indumentaria",
    accion: "Shooting",
  },
  {
    playbackId: "qLBXeJsH3jZeIuHpx02N026O6DMhOL1qTBIFUWUz22oZk",
    categoria: "Moda",
    accion: "Producción",
  },
  {
    playbackId: "a9Kc0294CGHe3l4TaUyzlFuwAPYBoR3T02FPSMjdVOxXY",
    categoria: "Moda",
    accion: "Shooting",
  },
  {
    playbackId: "AX9P00cpjx1OtH26x6xrUbjvo01L01j01p6IRCiepkvzY5A",
    categoria: "Comunidad",
    accion: "Casual",
  },
  {
    playbackId: "xjEHVJFcAssfjcA6DAZbGojyYmcxU00c2gz6KhU0079Yk",
    categoria: "Gastronomía",
    accion: "Behind the scenes",
  },
  {
    playbackId: "zcRIjkcmGV81WDklgieKlPxBxvuQIl01uHqxNamb7Lp00",
    categoria: "Gastronomía",
    accion: "Producción",
  },
];

type TextCardContent = { titulo: string; cuerpo: string };

const TEXT_CARDS: TextCardContent[] = [
  {
    titulo: "Producción continua",
    cuerpo: "Cada semana sale material nuevo. No es una campaña suelta, es un sistema.",
  },
  {
    titulo: "Cuatro rubros",
    cuerpo: "Indumentaria, gastronomía, real estate y comunidad. Distinto producto, mismo método.",
  },
  {
    titulo: "Pensado para pautar",
    cuerpo: "Cada pieza nace con un objetivo de campaña, no con un objetivo de calendario.",
  },
];

const TAGS = [
  "Meta Ads",
  "Tracking con CAPI",
  "Google Ads",
  "Atribución real",
  "Product Ads",
  "Optimización de ficha",
  "Contenido para pauta",
  "GA4",
  "Influencer marketing",
  "Diseño de marca",
  "Web y conversión",
];

// Mirrors the isotype geometry from HeroIsotype/Nav: a flat
// two-path triangle mark for the text cards' corner glyph.
const ISOTYPE_LEFT =
  "M 49.8 87.6 L 0 0 L 65.7 0 L 44.2 38.2 L 35.8 23.9 L 40.7 14.3 L 24.6 14.3 L 49.8 58 Z";
const ISOTYPE_RIGHT = "M 49.65 58 L 82.9 0 L 100 0 L 49.65 87.6 Z";

// The thumbnail API returns each source clip's own native ratio (verified:
// 400x1280 for all thirteen) when no `height` param is given, not a 9:16
// crop — object-fit:cover on the card handles the mismatch visually.
function posterUrl(playbackId: string) {
  return `https://image.mux.com/${playbackId}/thumbnail.webp?width=400&fit_mode=smartcrop&time=1`;
}

type CarouselItem = { kind: "video"; trabajo: Trabajo } | { kind: "text"; text: TextCardContent };

function buildCarouselItems(): CarouselItem[] {
  const items: CarouselItem[] = [];
  let textIndex = 0;
  TRABAJOS.forEach((trabajo, i) => {
    items.push({ kind: "video", trabajo });
    const videoNumber = i + 1;
    if (videoNumber === 4 || videoNumber === 8 || videoNumber === 12) {
      const text = TEXT_CARDS[textIndex];
      if (text) items.push({ kind: "text", text });
      textIndex += 1;
    }
  });
  return items;
}

const CAROUSEL_ITEMS = buildCarouselItems();

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden="true">
      <path d="M7 5.5 L19 12 L7 18.5 Z" fill="var(--on-dark)" />
    </svg>
  );
}

function TextCardIsotype() {
  return (
    <svg viewBox="0 0 100 87.6" width={24} height={24} aria-hidden="true" style={{ opacity: 0.4 }}>
      <path d={ISOTYPE_LEFT} fill="var(--pink)" />
      <path d={ISOTYPE_RIGHT} fill="var(--pink)" />
    </svg>
  );
}

type VideoCardProps = {
  trabajo: Trabajo;
  isPreviewing: boolean;
  reducedMotion: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onOpen: (trigger: HTMLElement) => void;
  cardRef: (el: HTMLDivElement | null) => void;
  playerRef: (el: MuxPlayerElement | null) => void;
};

function VideoCard({
  trabajo,
  isPreviewing,
  reducedMotion,
  onHoverStart,
  onHoverEnd,
  onOpen,
  cardRef,
  playerRef,
}: VideoCardProps) {
  const label = `${trabajo.categoria} — ${trabajo.accion}`;

  return (
    <div
      ref={cardRef}
      role="button"
      tabIndex={0}
      aria-label={label}
      className="trabajos-video-card"
      onMouseEnter={reducedMotion ? undefined : onHoverStart}
      onMouseLeave={reducedMotion ? undefined : onHoverEnd}
      onClick={(e) => onOpen(e.currentTarget)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          onOpen(e.currentTarget);
        }
      }}
    >
      {isPreviewing ? (
        <MuxPlayer
          ref={playerRef}
          playbackId={trabajo.playbackId}
          poster={posterUrl(trabajo.playbackId)}
          autoPlay="muted"
          muted
          loop
          playsInline
          nohotkeys
          className="trabajos-video-media"
          style={{ "--controls": "none", "--media-object-fit": "cover" }}
        />
      ) : (
        <img
          src={posterUrl(trabajo.playbackId)}
          alt={label}
          width={400}
          height={1280}
          loading="lazy"
          className="trabajos-video-media"
        />
      )}

      <div className="trabajos-video-overlay">
        <p className="trabajos-video-categoria">{trabajo.categoria}</p>
        <p className="trabajos-video-accion">{trabajo.accion}</p>
      </div>

      {!isPreviewing && (
        <span className="trabajos-play-button" aria-hidden="true">
          <PlayIcon />
        </span>
      )}
    </div>
  );
}

function TextCard({ content }: { content: TextCardContent }) {
  return (
    <div className="trabajos-text-card">
      <div>
        <h3 className="trabajos-text-title">{content.titulo}</h3>
        <p className="trabajos-text-body">{content.cuerpo}</p>
      </div>
      <div className="trabajos-text-isotype">
        <TextCardIsotype />
      </div>
    </div>
  );
}

function TrabajosModal({ trabajo, onClose }: { trabajo: Trabajo; onClose: () => void }) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="trabajos-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="trabajos-modal-content">
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="trabajos-modal-close"
          aria-label="Cerrar video"
        >
          ×
        </button>
        <MuxPlayer
          playbackId={trabajo.playbackId}
          poster={posterUrl(trabajo.playbackId)}
          autoPlay
          playsInline
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
}

export function Trabajos() {
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [modalTrabajo, setModalTrabajo] = useState<Trabajo | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const activePlayerRef = useRef<MuxPlayerElement | null>(null);
  const cardElsRef = useRef(new Map<string, HTMLElement>());
  const dragRef = useRef({ isDown: false, moved: false });
  const lastTriggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Auto-pause the previewing card if it scrolls out of view without a
  // proper mouseleave (e.g. the user wheel-scrolls the track while hovering).
  useEffect(() => {
    if (!previewId) return;
    const el = cardElsRef.current.get(previewId);
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) activePlayerRef.current?.pause();
        }
      },
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [previewId]);

  function handleHoverStart(id: string) {
    if (dragRef.current.isDown) return;
    setPreviewId(id);
  }

  function handleHoverEnd(id: string) {
    if (dragRef.current.isDown) return;
    setPreviewId((current) => (current === id ? null : current));
  }

  function openModal(trabajo: Trabajo, trigger: HTMLElement) {
    lastTriggerRef.current = trigger;
    setPreviewId(null);
    setModalTrabajo(trabajo);
  }

  function closeModal() {
    setModalTrabajo(null);
    lastTriggerRef.current?.focus();
  }

  function handleMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const startX = e.clientX;
    const scrollLeftStart = viewport.scrollLeft;
    dragRef.current = { isDown: true, moved: false };
    viewport.dataset["dragging"] = "true";

    function handleMove(ev: MouseEvent) {
      if (!dragRef.current.isDown || !viewport) return;
      const dx = ev.clientX - startX;
      if (Math.abs(dx) > 5) dragRef.current.moved = true;
      viewport.scrollLeft = scrollLeftStart - dx;
    }

    function handleUp() {
      dragRef.current.isDown = false;
      if (viewport) delete viewport.dataset["dragging"];
      if (dragRef.current.moved && viewport) {
        const blockNextClick = (ev: MouseEvent) => {
          ev.stopPropagation();
          ev.preventDefault();
        };
        viewport.addEventListener("click", blockNextClick, { capture: true, once: true });
      }
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    }

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  }

  return (
    <section className="section-v">
      <div className="container-v text-center">
        <span className="eyebrow text-on-dark-2">Trabajos</span>
        <h2 className="display-l mx-auto mt-4 text-on-dark">
          Contenido producido para pautar,
          <br />
          no para llenar el feed.
        </h2>
      </div>

      <div
        ref={viewportRef}
        className="trabajos-track-viewport mt-16"
        onMouseDown={handleMouseDown}
      >
        <div className="trabajos-track">
          {CAROUSEL_ITEMS.map((item) =>
            item.kind === "video" ? (
              <VideoCard
                key={item.trabajo.playbackId}
                trabajo={item.trabajo}
                isPreviewing={previewId === item.trabajo.playbackId}
                reducedMotion={reducedMotion}
                onHoverStart={() => handleHoverStart(item.trabajo.playbackId)}
                onHoverEnd={() => handleHoverEnd(item.trabajo.playbackId)}
                onOpen={(trigger) => openModal(item.trabajo, trigger)}
                cardRef={(el) => {
                  if (el) cardElsRef.current.set(item.trabajo.playbackId, el);
                  else cardElsRef.current.delete(item.trabajo.playbackId);
                }}
                playerRef={(el) => {
                  activePlayerRef.current = el;
                }}
              />
            ) : (
              <TextCard key={item.text.titulo} content={item.text} />
            ),
          )}
        </div>
      </div>

      <div className="mt-10">
        <Marquee duration={30} reverse>
          {TAGS.map((tag) => (
            <span key={tag} className="trabajos-tag">
              {tag}
            </span>
          ))}
        </Marquee>
      </div>

      {modalTrabajo && <TrabajosModal trabajo={modalTrabajo} onClose={closeModal} />}
    </section>
  );
}
