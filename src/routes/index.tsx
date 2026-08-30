import { createFileRoute } from "@tanstack/react-router";
import { SequenceA } from "@/components/sections/sequenceA/SequenceA";
import { Trabajos } from "@/components/sections/Trabajos";
import { Motores } from "@/components/sections/Motores";
import { Servicios } from "@/components/sections/Servicios";
import { Clientes } from "@/components/sections/Clientes";
import { Contacto } from "@/components/sections/Contacto";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Velocentum — Equipo de crecimiento" },
      {
        name: "description",
        content:
          "Velocentum es un equipo de crecimiento: estrategia, contenido, pauta y medición integrados para hacer crecer negocios.",
      },
      {
        property: "og:title",
        content: "Velocentum — Equipo de crecimiento",
      },
      {
        property: "og:description",
        content: "Estrategia, contenido, pauta y medición integrados para hacer crecer negocios.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <SequenceA />
      <Motores />
      <Servicios />
      <Trabajos />
      <Clientes />
      <Contacto />
    </>
  );
}
