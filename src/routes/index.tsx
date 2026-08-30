import { createFileRoute } from "@tanstack/react-router";
import { SequenceA } from "@/components/sections/sequenceA/SequenceA";
import { SequenceB } from "@/components/sections/sequenceB/SequenceB";
import { ServiciosToTrabajosHandoff } from "@/components/sections/ServiciosToTrabajosHandoff";
import { Trabajos } from "@/components/sections/Trabajos";
import { Clientes } from "@/components/sections/Clientes";
import { ClientesToContactoHandoff } from "@/components/sections/ClientesToContactoHandoff";
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
      <SequenceB />
      <ServiciosToTrabajosHandoff />
      <Trabajos />
      <Clientes />
      <ClientesToContactoHandoff />
      <Contacto />
    </>
  );
}
