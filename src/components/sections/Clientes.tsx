import { useRef } from "react";
import { Marquee } from "@/components/Marquee";
import { SceneGuideFragment } from "@/components/scene/SceneGuideFragment";
import { u } from "@/components/scene/sceneUnits";
import { useNavLightRegion } from "@/hooks/useNavLight";
import { useReveal } from "@/hooks/useReveal";
import {
  CLIENTES_CANVAS_HEIGHT,
  CLIENTES_COPY,
  CLIENTES_COPY_BOX,
  CLIENTES_FRAME,
  CLIENTES_GUIDE_PATH,
  CLIENTES_GUIDE_REST,
  CLIENTES_MARQUEE_DURATION,
} from "@/components/sections/home/clientesSceneContent";

// These sit in src/assets/logos/ as Lovable asset manifests (*.png.asset.json,
// uploaded straight to Lovable's CDN rather than checked in as binaries), so
// the src below is each manifest's own `url` field, not a bundler import.
const CLIENT_LOGOS = [
  {
    src: "/__l5e/assets-v1/be86af35-370f-4c7f-a8e2-9d77e91e1e1a/Caracter_Logo_Cliente_-_1_20260829_182214_0000.png",
    alt: "Carácter",
  },
  {
    src: "/__l5e/assets-v1/4590c03a-1e3e-432e-9eea-324574600623/ComercialPas_20260829_182233_0000.png",
    alt: "Comercial Pas",
  },
  {
    src: "/__l5e/assets-v1/4fb175bf-07f8-4084-a7e2-5915ccd239f5/PV_S.A_-_Archivo_-_transparente.png",
    alt: "Patagonia Vessels",
  },
  {
    src: "/__l5e/assets-v1/5f07f658-0163-44c1-9596-a33d58d662fc/armbruster_20260829_182344_0000.png",
    alt: "Armbruster",
  },
  {
    src: "/__l5e/assets-v1/508951b7-363f-44b9-b9d1-33ae6b802e4f/buynow_20260829_182306_0000.png",
    alt: "Buy Now",
  },
  {
    src: "/__l5e/assets-v1/5e61e66c-d3eb-4435-9ce1-c7787dfb3710/glam_20260829_182407_0000.png",
    alt: "Glam Ragazza",
  },
  {
    src: "/__l5e/assets-v1/9e23f130-3c3b-4f0a-a2e9-994bb4675504/greenpac_20260829_182351_0000.png",
    alt: "Green Pac",
  },
  {
    src: "/__l5e/assets-v1/dce57b41-6f78-48d8-a14a-471a20bf25d1/ilsapore_20260829_182206_0000.png",
    alt: "Il Sapore",
  },
  {
    src: "/__l5e/assets-v1/4e2e2bc8-6004-4364-9e59-f3350d289663/lamina_20260829_182246_0000.png",
    alt: "Lamina",
  },
  {
    src: "/__l5e/assets-v1/d44b2d29-a982-4411-9c9b-d376c36ec635/snake_20260829_182330_0000.png",
    alt: "Snake Store",
  },
  {
    src: "/__l5e/assets-v1/2cdf43eb-520f-4c55-b38b-70a72f93a285/uprise_20260829_182254_0000.png",
    alt: "Uprise",
  },
  {
    src: "/__l5e/assets-v1/4da938c1-5877-47ee-861e-ab89b5d6e1ee/vinotique_20260829_182314_0000.png",
    alt: "Vinotique",
  },
];

// The manifests carry no width/height metadata and the source PNGs aren't
// locally inspectable (CDN-only), so this is a placeholder ratio rather than
// each logo's true intrinsic size — it still reserves layout space, just not
// a byte-exact one. Swap in real dimensions once the files are inspectable.
const LOGO_WIDTH_PLACEHOLDER = 120;
const LOGO_HEIGHT = 34;

/**
 * Sección 08 — Con quiénes trabajamos.
 *
 * ÚNICA SECCIÓN CLARA DE LA HOME. El cambio de fondo es el gesto principal y no
 * hace falta ningún otro: sin objetos, sin piezas, sin atmósferas. Fondo
 * --surface, BLANCO PURO, no --surface-2: ese pase se leía deslavado en vez de
 * como un corte neutro premium.
 *
 * TRAMO DE DESCANSO. No hay explosión ni reconstrucción: la única pieza del
 * Crystal 5 en cuadro es el fragmento guía de paso.
 *
 * ALTURA DE CONTENIDO, no 100vh: la sección cierra en 612 y el bloque siguiente
 * arranca inmediatamente después.
 */
export function Clientes() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const copyRef = useReveal<HTMLDivElement>();

  // El nav conserva UN ÚNICO COMPONENTE y solo cambia de tema mientras esta
  // sección lo atraviesa. El cruce es progresivo sobre una franja de ~100 px,
  // en las dos direcciones.
  useNavLightRegion(sectionRef);

  return (
    <section ref={sectionRef} className="clientes-section">
      <div className="clientes-canvas" style={{ height: u(CLIENTES_CANVAS_HEIGHT) }}>
        <div
          ref={copyRef}
          className="scene-copy scene-copy-center reveal"
          data-revealed="false"
          style={{
            top: u(CLIENTES_COPY_BOX.top),
            paddingInline: u(CLIENTES_COPY_BOX.paddingInline),
          }}
        >
          <span className="scene-eyebrow clientes-eyebrow">{CLIENTES_COPY.eyebrow}</span>
          <h2 className="scene-h2 clientes-headline">{CLIENTES_COPY.headline}</h2>
        </div>

        {/* El frame es una CARD, no una fila desnuda. */}
        <div
          className="clientes-frame"
          style={{
            left: u(CLIENTES_FRAME.left),
            top: u(CLIENTES_FRAME.top),
            width: u(CLIENTES_FRAME.width),
            height: u(CLIENTES_FRAME.height),
          }}
        >
          <Marquee duration={CLIENTES_MARQUEE_DURATION}>
            {CLIENT_LOGOS.map((logo) => (
              <img
                key={logo.src}
                src={logo.src}
                alt={logo.alt}
                width={LOGO_WIDTH_PLACEHOLDER}
                height={LOGO_HEIGHT}
                loading="lazy"
                className="clientes-logo"
              />
            ))}
          </Marquee>
        </div>

        {/* SVG INTACTO: lo único propio de esta sección es la sombra rosa. El
            drop-shadow negro del resto de la HOME se lee como una mancha sucia
            sobre blanco. */}
        <div className="clientes-guide" aria-hidden="true">
          <SceneGuideFragment
            sectionRef={sectionRef}
            spec={CLIENTES_GUIDE_PATH}
            restLocal={CLIENTES_GUIDE_REST}
            zIndex={24}
          />
        </div>
      </div>
    </section>
  );
}
