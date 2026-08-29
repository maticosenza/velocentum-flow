import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/casos")({
  head: () => ({
    meta: [
      { title: "Casos — Velocentum" },
      {
        name: "description",
        content:
          "Casos y resultados de las cuentas gestionadas por Velocentum.",
      },
      { property: "og:title", content: "Casos — Velocentum" },
      {
        property: "og:description",
        content:
          "Casos y resultados de las cuentas gestionadas por Velocentum.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/casos" },
    ],
    links: [{ rel: "canonical", href: "/casos" }],
  }),
  component: Casos,
});

function Casos() {
  return (
    <div className="container-v section-v">
      <h1 className="display-l">Casos</h1>
    </div>
  );
}
