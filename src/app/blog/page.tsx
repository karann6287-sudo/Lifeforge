import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Blog",
  description: "Stories and strategies from the forge. Articles are coming soon.",
};

export default function BlogPage() {
  return (
    <InfoPage
      eyebrow="Blog"
      title={<>Dispatches from the forge</>}
      lede="Design notes, habit strategies, and changelogs will live here. We publish nothing fake — the first real entry is still being written."
    >
      <div className="rounded-2xl border border-dashed border-primary/30 bg-card/40 p-10 text-center">
        <p aria-hidden="true" className="text-5xl">📜</p>
        <h2 className="mt-4 text-2xl font-bold">Coming soon</h2>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">
          No articles yet. When the forge has news worth sharing, you&apos;ll find it here.
        </p>
      </div>
    </InfoPage>
  );
}
