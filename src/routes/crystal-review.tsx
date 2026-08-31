import { createFileRoute } from "@tanstack/react-router";
import {
  CrystalFiveApproved,
  CrystalFiveFragmentsApproved,
} from "@/components/brand/CrystalFiveApproved";
import "@/crystal-review.css";

export const Route = createFileRoute("/crystal-review")({
  head: () => ({ meta: [{ title: "Crystal 5 — Revisión aislada" }] }),
  validateSearch: (search: Record<string, unknown>) => ({
    view:
      search.view === "assembled" || search.view === "fragments" ? search.view : ("both" as const),
  }),
  component: CrystalReview,
});

function CrystalReview() {
  const { view } = Route.useSearch();
  const isSingle = view !== "both";

  return (
    <main className="crystal-review-page">
      <section
        className={`crystal-review-stage ${isSingle ? "crystal-review-stage-single" : ""}`}
        aria-label="Revisión aislada de Crystal 5"
      >
        {view !== "fragments" && (
          <figure className="crystal-review-piece">
            <div className="crystal-review-glow" />
            <CrystalFiveApproved className="crystal-review-assembled" />
            <figcaption>CRYSTAL 5 · PROPUESTA DESIGN SYSTEM</figcaption>
          </figure>
        )}

        {view !== "assembled" && (
          <figure className="crystal-review-piece">
            <div className="crystal-review-glow" />
            <CrystalFiveFragmentsApproved className="crystal-review-fragments" />
            <figcaption>CRYSTAL 5 · ROTURA CORRESPONDIENTE</figcaption>
          </figure>
        )}
      </section>
    </main>
  );
}
