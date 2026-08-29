import { useEffect, useRef, useState } from "react";
import { useScrollRange } from "@/hooks/useScrollEngine";

type PieceState = { x: number; y: number; rotate: number };
type Piece = { label: string; disordered: PieceState; aligned: PieceState };

// Shared scatter/aligned pair per piece: card 01 rests permanently at
// `disordered`; card 02 starts there and resolves into `aligned` as it
// scrolls into view. `aligned` traces the isotype's downward-pointing
// triangle: 3 tiles across the top, 2 narrower in the middle, 1 below, and
// the last piece as the vertex.
const PIECES: Piece[] = [
  {
    label: "Meta Ads",
    disordered: { x: -75, y: -85, rotate: -14 },
    aligned: { x: -90, y: -90, rotate: 0 },
  },
  {
    label: "Google Ads",
    disordered: { x: 55, y: -70, rotate: 12 },
    aligned: { x: 0, y: -90, rotate: 0 },
  },
  {
    label: "Product Ads",
    disordered: { x: -35, y: -15, rotate: 18 },
    aligned: { x: 90, y: -90, rotate: 0 },
  },
  {
    label: "Web y conversión",
    disordered: { x: 40, y: 5, rotate: -9 },
    aligned: { x: -45, y: -30, rotate: 0 },
  },
  {
    label: "Contenido",
    disordered: { x: -85, y: 55, rotate: 8 },
    aligned: { x: 45, y: -30, rotate: 0 },
  },
  {
    label: "Influencer marketing",
    disordered: { x: 45, y: 80, rotate: -17 },
    aligned: { x: 0, y: 30, rotate: 0 },
  },
  {
    label: "Diseño de marca",
    disordered: { x: 5, y: 15, rotate: 15 },
    aligned: { x: 0, y: 90, rotate: 0 },
  },
];

function mix(from: number, to: number, t: number) {
  return from + (to - from) * t;
}

function pieceTransform(p: PieceState) {
  return `translate(-50%, -50%) translate(${p.x}px, ${p.y}px) rotate(${p.rotate}deg)`;
}

type PiecesProps = {
  borderColor: string;
  background: string;
};

/** Card 01's composition: always scattered, no motion. */
function ScatteredPieces({ borderColor, background }: PiecesProps) {
  return (
    <div className="contraste-stage" aria-hidden="true">
      {PIECES.map((piece) => (
        <div
          key={piece.label}
          className="contraste-piece"
          style={{ borderColor, background, transform: pieceTransform(piece.disordered) }}
        >
          <span>{piece.label}</span>
        </div>
      ))}
    </div>
  );
}

/** Card 02's composition: scattered → aligned, driven by the card's scroll progress. */
function AlignedPieces({
  borderColor,
  background,
  cardRef,
}: PiecesProps & {
  cardRef: React.RefObject<HTMLElement | null>;
}) {
  const pieceRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (!reducedMotion) return;
    pieceRefs.current.forEach((el, i) => {
      const piece = PIECES[i];
      if (el && piece) el.style.transform = pieceTransform(piece.aligned);
    });
  }, [reducedMotion]);

  useScrollRange(
    cardRef,
    (progress) => {
      if (reducedMotion) return;
      pieceRefs.current.forEach((el, i) => {
        const piece = PIECES[i];
        if (!el || !piece) return;
        const { disordered: from, aligned: to } = piece;
        el.style.transform = pieceTransform({
          x: mix(from.x, to.x, progress),
          y: mix(from.y, to.y, progress),
          rotate: mix(from.rotate, to.rotate, progress),
        });
      });
    },
    // end:1 resolves the moment the card's bottom reaches the viewport's own
    // bottom edge — i.e. as soon as the whole card has scrolled into view —
    // instead of requiring it to keep scrolling toward exiting the top,
    // which a short page (nothing below Contraste yet) may not have room for.
    { start: 1, end: 1 },
  );

  return (
    <div className="contraste-stage" aria-hidden="true">
      {PIECES.map((piece, i) => (
        <div
          key={piece.label}
          ref={(el) => {
            pieceRefs.current[i] = el;
          }}
          className="contraste-piece"
          style={{ borderColor, background }}
        >
          <span>{piece.label}</span>
        </div>
      ))}
    </div>
  );
}

type CardProps = {
  number: string;
  numberColor: string;
  title: string;
  titleColor: string;
  body: string;
  cardClassName: string;
  pieces: React.ReactNode;
  cardRef?: React.RefObject<HTMLElement | null>;
};

function ContrasteCard({
  number,
  numberColor,
  title,
  titleColor,
  body,
  cardClassName,
  pieces,
  cardRef,
}: CardProps) {
  return (
    <article ref={cardRef} className={`contraste-card ${cardClassName}`}>
      <div className="flex h-full flex-col gap-8 min-[900px]:flex-row min-[900px]:items-center">
        <div className="min-[900px]:w-[65%]">
          <span className="label-mono" style={{ color: numberColor }}>
            {number}
          </span>
          <h3 className="display-m mt-4" style={{ color: titleColor }}>
            {title}
          </h3>
          <p className="body-l mt-4 max-w-[46ch] text-on-dark">{body}</p>
        </div>
        <div className="hidden min-[900px]:block min-[900px]:w-[35%]">{pieces}</div>
      </div>
    </article>
  );
}

export function Contraste() {
  const card2Ref = useRef<HTMLElement | null>(null);

  return (
    <section className="section-v bg-ink-deep">
      <div className="container-v">
        <div className="mx-auto max-w-[70ch] text-center">
          <span className="eyebrow text-on-dark-2">Anuncios sueltos no son una estrategia</span>
          <h2 className="display-l mt-4 text-on-dark">
            No es que la pauta no funcione.
            <br />
            Es que nadie está mirando el negocio completo.
          </h2>
        </div>

        <div className="mt-16 flex flex-col gap-6">
          <ContrasteCard
            number="01."
            numberColor="#6E8BFF"
            title="Todo por separado"
            titleColor="#6E8BFF"
            body="El que hace el contenido no habla con el que hace la pauta. La web va por un lado, la marca por otro. Cada uno entrega lo suyo y nadie mira el número final."
            cardClassName="contraste-card-01"
            pieces={<ScatteredPieces borderColor="#2A1EC9" background="transparent" />}
          />

          <ContrasteCard
            cardRef={card2Ref}
            number="02."
            numberColor="var(--violet)"
            title="Todo sobre el mismo número"
            titleColor="var(--violet)"
            body="Contenido, pauta, web y medición trabajando en la misma dirección. Un plan escrito, con prioridades y orden de ejecución. Y una sola cosa que mirar: tu facturación."
            cardClassName="contraste-card-02"
            pieces={
              <AlignedPieces
                cardRef={card2Ref}
                borderColor="var(--violet)"
                background="rgba(123,92,255,0.12)"
              />
            }
          />
        </div>
      </div>
    </section>
  );
}
