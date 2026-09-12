import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Ground rules for using LIFEFORGE at this hackathon project stage.",
};

export default function TermsPage() {
  return (
    <InfoPage
      eyebrow="Terms"
      title={<>Terms of service</>}
      lede="Short, honest ground rules for a hackathon-stage app. Nothing here is legal advice and nothing promises what the project cannot deliver."
    >
      <section aria-label="Using the app" className="rounded-2xl border bg-card/50 p-5 sm:p-6 space-y-3 text-sm">
        <h2 className="text-xl font-bold">Using the app</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
          <li>You must provide accurate account information and keep your credentials private.</li>
          <li>Quest rewards are computed by the app from difficulty and category — they carry no monetary value.</li>
          <li>Inventory, shop, and leaderboard areas are previews; disabled actions are intentionally non-functional.</li>
        </ul>
      </section>
      <section aria-label="Acceptable use" className="rounded-2xl border bg-card/50 p-5 sm:p-6 space-y-3 text-sm">
        <h2 className="text-xl font-bold">Acceptable use</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
          <li>Do not attempt to access other users&apos; data or to bypass the app&apos;s access controls.</li>
          <li>Do not abuse the service: no spam, no harmful content, no interference with other adventurers.</li>
          <li>Accounts used to undermine the service may be suspended or removed.</li>
        </ul>
      </section>
      <section aria-label="Availability" className="rounded-2xl border bg-card/50 p-5 sm:p-6 space-y-3 text-sm">
        <h2 className="text-xl font-bold">Availability</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
          <li>LIFEFORGE is provided as-is at this project stage, without uptime or support guarantees.</li>
          <li>Features may change or be removed as the project evolves; progression data may be reset between major milestones.</li>
        </ul>
      </section>
    </InfoPage>
  );
}
