import { createFileRoute } from "@tanstack/react-router";
import { HeroTrazado } from "@/components/hero/HeroTrazado";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Velocentum — Marketing de performance en Argentina" },
      {
        name: "description",
        content:
          "Velocentum es una agencia de marketing de performance en Argentina enfocada en crecimiento medible.",
      },
      {
        property: "og:title",
        content: "Velocentum — Marketing de performance en Argentina",
      },
      {
        property: "og:description",
        content:
          "Agencia de marketing de performance en Argentina enfocada en crecimiento medible.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  return <HeroTrazado />;
}
