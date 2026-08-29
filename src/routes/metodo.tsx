import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/metodo")({
  head: () => ({
    meta: [
      { title: "Método — Velocentum" },
      {
        name: "description",
        content: "El método de trabajo de Velocentum para escalar performance con datos.",
      },
      { property: "og:title", content: "Método — Velocentum" },
      {
        property: "og:description",
        content: "El método de trabajo de Velocentum para escalar performance con datos.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/metodo" },
    ],
    links: [{ rel: "canonical", href: "/metodo" }],
  }),
  component: Metodo,
});

const BLOCKS = [
  {
    number: "01.",
    title: "Qué preguntamos",
    body: "En una llamada de 45 minutos revisamos de dónde vienen tus ventas hoy, qué estás pautando, cómo está armada tu web o tienda, y qué contenido estás produciendo. Sin formularios largos: una conversación con las preguntas que hacen falta.",
  },
  {
    number: "02.",
    title: "Qué medimos",
    body: "Miramos los números que ya tenés: facturación, inversión en pauta, tasa de conversión, y cómo está configurado tu seguimiento. En la mayoría de los casos aparece una brecha entre lo que reporta la plataforma y lo que entra en caja. Esa brecha es el primer diagnóstico.",
  },
  {
    number: "03.",
    title: "Qué proyectamos",
    body: "Con eso armamos una proyección a 90 días: qué se puede mover, cuánto, y con qué inversión. No es una promesa de resultado, es un escenario con supuestos explícitos que podés discutir.",
  },
  {
    number: "04.",
    title: "Qué recomendamos",
    body: "Recién ahí decimos qué frentes activar y en qué orden. Puede ser que necesites pauta. Puede ser que primero haya que arreglar la web, o que sin contenido no tenga sentido escalar. El orden importa más que la lista.",
  },
];

function Metodo() {
  return (
    <>
      <section className="container-v section-v pt-36 text-center">
        <span className="eyebrow text-on-dark-2">Método</span>
        <h1 className="display-l mx-auto mt-4 max-w-[24ch] text-on-dark">
          Primero entender. Después proponer.
        </h1>
        <p className="body-l mx-auto mt-4 max-w-[56ch] text-on-dark-2">
          La mayoría de las agencias te cotiza un servicio antes de mirar tu negocio. Nosotros
          hacemos al revés: analizamos, y de ahí sale qué te conviene activar y en qué orden.
        </p>
      </section>

      <section className="container-v">
        <div className="flex flex-col gap-24">
          {BLOCKS.map((block, i) => {
            const alignRight = i % 2 === 1;
            return (
              <Reveal
                key={block.number}
                as="article"
                index={i}
                className={cn(
                  "max-w-[60ch]",
                  alignRight ? "md:ml-auto md:max-w-[52ch] md:text-right" : "md:max-w-[52ch]",
                )}
              >
                <span className="label-mono" style={{ color: "var(--violet)" }}>
                  {block.number}
                </span>
                <h3 className="display-m mt-4 text-on-dark">{block.title}</h3>
                <p className="body-base mt-4 text-on-dark-2">{block.body}</p>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="container-v section-v flex justify-center">
        <div className="mx-auto max-w-[720px] rounded-3xl border border-border bg-ink-deep-2 text-center [padding:clamp(32px,4vw,56px)]">
          <h2 className="display-m text-on-dark">El análisis no tiene costo.</h2>
          <p className="body-base mt-4 text-on-dark-2">
            Y no termina en una propuesta si no hay algo real que proponer. Si tu negocio todavía no
            está para invertir en pauta, te lo vamos a decir.
          </p>
          <a
            href="/#contacto"
            className="hero-cta body-base mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 font-medium text-on-dark"
          >
            Reservá tu análisis de negocio
            <span className="hero-cta-arrow" style={{ color: "#B9AEFF" }} aria-hidden="true">
              →
            </span>
          </a>
        </div>
      </section>
    </>
  );
}
