import { createFileRoute } from "@tanstack/react-router";

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

function Metodo() {
  return (
    <div className="container-v section-v pt-36">
      <span className="eyebrow mb-3 block text-on-dark-2">Cómo trabajamos</span>
      <h1 className="display-l text-on-dark">Método</h1>
    </div>
  );
}
