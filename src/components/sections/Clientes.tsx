import { Marquee } from "@/components/Marquee";

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

export function Clientes() {
  return (
    <section className="section-v clientes-section">
      <div className="container-v text-center">
        <span className="eyebrow text-ink-2">Con quiénes trabajamos</span>
        <h2 className="display-l mt-4 text-ink">Detrás de cada una hay un plan escrito.</h2>
      </div>

      <div className="mt-16">
        <Marquee duration={42}>
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
    </section>
  );
}
