import { useEffect, useRef, useState } from "react";
import { lerp, LERP_FACTOR, useScrollRange } from "@/hooks/useScrollEngine";

// Mirrors the isotype geometry from HeroIsotype/Nav, used here as a flat
// two-path triangle mark for each service card's icon.
const ISOTYPE_LEFT =
  "M 49.8 87.6 L 0 0 L 65.7 0 L 44.2 38.2 L 35.8 23.9 L 40.7 14.3 L 24.6 14.3 L 49.8 58 Z";
const ISOTYPE_RIGHT = "M 49.65 58 L 82.9 0 L 100 0 L 49.65 87.6 Z";

type Service = { label: string; text: string };

const SERVICES: Service[] = [
  { label: "Meta Ads", text: "Campañas que se optimizan sobre venta real, no sobre clics." },
  { label: "Google Ads", text: "Búsqueda y shopping para capturar la demanda que ya existe." },
  { label: "Product Ads", text: "Catálogo conectado y fichas que compiten en el feed." },
  { label: "Web y conversión", text: "Desarrollo y optimización de lo que pasa después del clic." },
  { label: "Contenido", text: "Planificación y producción de piezas pensadas para pautar." },
  {
    label: "Influencer marketing",
    text: "Colaboraciones con creadoras y microinfluencers, con seguimiento.",
  },
  { label: "Diseño de marca", text: "Identidad que sostiene todo lo anterior." },
];

// A tick still short of settling keeps the rAF loop alive; once the gap to
// target is imperceptible we snap to it exactly and let the loop go idle.
const SETTLE_EPSILON = 0.0008;

function ServiceIcon() {
  return (
    <svg viewBox="0 0 100 87.6" width={56} height={56} aria-hidden="true">
      <path
        d={ISOTYPE_LEFT}
        fill="var(--violet)"
        fillOpacity={0.25}
        stroke="var(--violet)"
        strokeWidth={2}
      />
      <path
        d={ISOTYPE_RIGHT}
        fill="var(--violet)"
        fillOpacity={0.25}
        stroke="var(--violet)"
        strokeWidth={2}
      />
    </svg>
  );
}

function ServiceCard({ service, active }: { service: Service; active: boolean }) {
  return (
    <article
      className="servicios-card"
      style={
        active ? { borderColor: "rgba(123,92,255,0.55)", backgroundColor: "#191243" } : undefined
      }
    >
      <ServiceIcon />
      <span className="servicios-card-label mt-6 block">{service.label}</span>
      <p className="mt-3 text-[1.02rem] text-on-dark">{service.text}</p>
    </article>
  );
}

export function Servicios() {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const fillRef = useRef<HTMLDivElement | null>(null);

  const isDesktopRef = useRef(true);
  const reducedMotionRef = useRef(false);
  const metricsRef = useRef({ scrollWidth: 0, clientWidth: 0 });
  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const activeIndexRef = useRef(0);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const mqDesktop = window.matchMedia("(min-width: 900px)");
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncDesktop = () => {
      isDesktopRef.current = mqDesktop.matches;
    };
    const syncMotion = () => {
      reducedMotionRef.current = mqMotion.matches;
    };
    syncDesktop();
    syncMotion();
    mqDesktop.addEventListener("change", syncDesktop);
    mqMotion.addEventListener("change", syncMotion);
    return () => {
      mqDesktop.removeEventListener("change", syncDesktop);
      mqMotion.removeEventListener("change", syncMotion);
    };
  }, []);

  useEffect(() => {
    function measure() {
      const track = trackRef.current;
      const viewport = viewportRef.current;
      if (!track || !viewport) return;
      metricsRef.current = { scrollWidth: track.scrollWidth, clientWidth: viewport.clientWidth };
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  function applyProgress(p: number) {
    const { scrollWidth, clientWidth } = metricsRef.current;
    const maxX = Math.max(scrollWidth - clientWidth, 0);
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${(-p * maxX).toFixed(2)}px, 0, 0)`;
    }
    if (fillRef.current) {
      fillRef.current.style.transform = `scaleX(${p})`;
    }
    const nextIndex = Math.min(SERVICES.length - 1, Math.floor(p * SERVICES.length));
    if (nextIndex !== activeIndexRef.current) {
      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
    }
  }

  function tick() {
    const target = targetRef.current;
    const next = lerp(currentRef.current, target, LERP_FACTOR);
    currentRef.current = next;
    applyProgress(next);

    if (Math.abs(target - next) > SETTLE_EPSILON) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      currentRef.current = target;
      applyProgress(target);
      rafRef.current = null;
    }
  }

  useScrollRange(
    outerRef,
    (progress) => {
      if (!isDesktopRef.current) return;
      targetRef.current = progress;

      if (reducedMotionRef.current) {
        currentRef.current = progress;
        applyProgress(progress);
        return;
      }

      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(tick);
      }
    },
    // start:0/end:0 lines progress up with the pin itself: 0 the instant the
    // sticky container reaches the top of the viewport, 1 the instant this
    // 480vh outer box has scrolled fully past and the pin releases.
    { start: 0, end: 0 },
  );

  function handleSkip() {
    const outer = outerRef.current;
    if (!outer) return;
    const rect = outer.getBoundingClientRect();
    window.scrollTo({ top: rect.bottom + window.scrollY, behavior: "smooth" });
  }

  return (
    <section ref={outerRef} className="servicios-outer">
      <div className="servicios-sticky">
        <div className="container-v w-full">
          <div className="servicios-grid">
            <aside className="servicios-fixed-card">
              <span className="eyebrow text-on-dark-2">Siete frentes</span>
              <h2 className="display-m mt-4 text-on-dark">No elegís vos qué contratar.</h2>
              <p className="mt-4 text-[0.95rem] text-on-dark-2">
                El análisis define qué frentes conviene activar y en qué orden, según dónde está tu
                negocio hoy. No todo desde el día uno.
              </p>

              <div className="servicios-progress mt-8">
                <span className="label-mono" style={{ color: "var(--violet)" }}>
                  {String(activeIndex + 1).padStart(2, "0")} /{" "}
                  {String(SERVICES.length).padStart(2, "0")}
                </span>
                <div className="servicios-progress-track mt-3">
                  <div ref={fillRef} className="servicios-progress-fill" />
                </div>
              </div>

              <button type="button" onClick={handleSkip} className="servicios-skip mt-8">
                Saltear →
              </button>
            </aside>

            <div ref={viewportRef} className="servicios-track-viewport">
              <div ref={trackRef} className="servicios-track">
                {SERVICES.map((service, i) => (
                  <ServiceCard key={service.label} service={service} active={i === activeIndex} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
