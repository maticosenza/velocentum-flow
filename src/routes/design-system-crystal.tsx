import { createFileRoute } from "@tanstack/react-router";
import {
  CrystalFiveApproved,
  CrystalFiveFragmentsApproved,
} from "@/components/brand/CrystalFiveApproved";
import "@/design-system-crystal.css";

export const Route = createFileRoute("/design-system-crystal")({
  head: () => ({ meta: [{ title: "Design System Crystal 5 — Velocentum" }] }),
  component: DesignSystemCrystal,
});

const MATERIALS = [
  ["LIGHT", "#FFF7FA", "#F56B9D"],
  ["HOT", "#FFB0CC", "#E82C70"],
  ["ROSE", "#F58FB4", "#5B243B"],
  ["GRAPHITE", "#5D4C5B", "#17141D"],
  ["DEEP", "#9E315E", "#261A27"],
  ["GLASS", "#FFFFFF", "#6C5364"],
] as const;

function GuideShard() {
  return (
    <svg viewBox="0 0 90 125" aria-hidden="true">
      <defs>
        <linearGradient id="guide-hot" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#FFB0CC" />
          <stop offset=".48" stopColor="#E82C70" />
          <stop offset="1" stopColor="#7C1C40" />
        </linearGradient>
        <linearGradient id="guide-dark" x1="1" y1="0" x2="0" y2="1">
          <stop stopColor="#5D4C5B" />
          <stop offset="1" stopColor="#17141D" />
        </linearGradient>
      </defs>
      <path
        d="M21 11L68 31L52 108L14 75Z"
        fill="#33182A"
        opacity=".56"
        transform="translate(4 5)"
      />
      <path d="M21 11L68 31L43 57Z" fill="url(#guide-hot)" />
      <path d="M21 11L43 57L14 75Z" fill="#F58FB4" opacity=".72" />
      <path d="M68 31L52 108L43 57Z" fill="url(#guide-dark)" />
      <path d="M14 75L43 57L52 108Z" fill="#B63366" opacity=".82" />
      <path
        d="M21 11L68 31L52 108L14 75ZM43 57L21 11M43 57L68 31M43 57L52 108M43 57L14 75"
        fill="none"
        stroke="#F8C6D8"
        strokeOpacity=".68"
        strokeWidth="1"
      />
    </svg>
  );
}

function DesignSystemCrystal() {
  return (
    <main className="dsc-page">
      <header className="dsc-header">
        <div>
          <span>VELOCENTUM · DESIGN SYSTEM APROBADO</span>
          <h1>Crystal 5 · Objeto narrativo</h1>
        </div>
        <p>
          Dos cuerpos cristalinos, dieciocho facetas reales y una sola materia que puede armarse,
          explotar, viajar y reconstruirse.
        </p>
      </header>

      <section className="dsc-role-grid">
        <article className="dsc-panel dsc-asset-panel">
          <div className="dsc-asset-stage">
            <CrystalFiveApproved className="dsc-main-crystal" />
          </div>
          <div className="dsc-panel-copy">
            <span>ROL 01 · OBJETO ARMADO</span>
            <h2>Crystal 5</h2>
            <p>Silueta ancha, doble cuerpo irregular, rosas y grafitos intercalados.</p>
          </div>
        </article>

        <article className="dsc-panel dsc-asset-panel">
          <div className="dsc-asset-stage">
            <CrystalFiveFragmentsApproved className="dsc-fragment-field" />
          </div>
          <div className="dsc-panel-copy">
            <span>ROL 02 · MISMA MATERIA</span>
            <h2>Rotura volumétrica</h2>
            <p>Las facetas reales se convierten en piezas con frente, lateral y subcaras.</p>
          </div>
        </article>
      </section>

      <section className="dsc-detail-grid">
        <article className="dsc-panel dsc-material-panel">
          <div className="dsc-section-title">
            <span>01</span>
            <h2>Materiales vectoriales</h2>
          </div>
          <div className="dsc-swatches">
            {MATERIALS.map(([name, from, to]) => (
              <div className="dsc-swatch" key={name}>
                <i style={{ background: `linear-gradient(135deg, ${from}, ${to})` }} />
                <b>{name}</b>
                <small>
                  {from} → {to}
                </small>
              </div>
            ))}
          </div>
        </article>

        <article className="dsc-panel dsc-rules-panel">
          <div className="dsc-section-title">
            <span>02</span>
            <h2>Construcción</h2>
          </div>
          <ol>
            <li>SVG escalable, nunca raster generado.</li>
            <li>Facetas asimétricas; ningún lado es espejo del otro.</li>
            <li>Rosa, vidrio y grafito alternados por cara.</li>
            <li>Aristas blanco-rosa muy finas.</li>
            <li>Imperfecciones internas de baja opacidad.</li>
            <li>Profundidad por superposición, no por ruido.</li>
          </ol>
        </article>
      </section>

      <section className="dsc-panel dsc-motion-panel">
        <div className="dsc-section-title">
          <span>03</span>
          <h2>Narrativa de movimiento</h2>
        </div>
        <div className="dsc-motion-strip">
          <div className="dsc-motion-state">
            <CrystalFiveApproved />
            <b>01 · ARMADO</b>
            <p>Respira en el Hero.</p>
          </div>
          <span className="dsc-arrow">→</span>
          <div className="dsc-motion-state">
            <CrystalFiveFragmentsApproved />
            <b>02 · EXPLOSIÓN</b>
            <p>Ocupa el viewport y sale por los bordes.</p>
          </div>
          <span className="dsc-arrow">→</span>
          <div className="dsc-motion-state dsc-guide-state">
            <GuideShard />
            <b>03 · FRAGMENTO GUÍA</b>
            <p>Desciende con peso, giro y trayectoria curva.</p>
          </div>
          <span className="dsc-arrow">→</span>
          <div className="dsc-motion-state">
            <CrystalFiveApproved />
            <b>04 · RECONSTRUCCIÓN</b>
            <p>Vuelve a completarse en Empecemos.</p>
          </div>
        </div>
      </section>

      <footer className="dsc-footer">
        <span>FUENTE VECTORIAL · src/components/brand/CrystalFiveApproved.tsx</span>
        <span>REGLAS · docs/DESIGN_SYSTEM_CRYSTAL.txt</span>
      </footer>
    </main>
  );
}
