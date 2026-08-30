import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/hero/Hero";
import { Dolor1, Dolor2 } from "@/components/sections/Dolores";
import { RevealSection } from "@/components/sections/RevealSection";
import { Trabajos } from "@/components/sections/Trabajos";
import { Motores } from "@/components/sections/Motores";
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
      <Hero />
      <Dolor1 />
      <Dolor2 />
      <RevealSection />
      <Motores />
      <Trabajos />
      <Clientes />
      <Contacto />
    </>
  );
}
