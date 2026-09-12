import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join the forge. There are currently no open roles.",
};

export default function CareersPage() {
  return (
    <InfoPage
      eyebrow="Careers"
      title={<>Help build the forge</>}
      lede="LIFEFORGE is a small hackathon-stage team. We hire slowly and honestly — and right now, the roster is full."
    >
      <div className="rounded-2xl border border-dashed border-primary/30 bg-card/40 p-10 text-center">
        <p aria-hidden="true" className="text-5xl">⚒️</p>
        <h2 className="mt-4 text-2xl font-bold">No open roles currently</h2>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">
          There are no positions available at this time. Check back later — or start your own
          adventure by forging quests today.
        </p>
      </div>
    </InfoPage>
  );
}
