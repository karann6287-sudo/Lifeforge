import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How LIFEFORGE handles your account and quest data at this project stage.",
};

export default function PrivacyPage() {
  return (
    <InfoPage
      eyebrow="Privacy"
      title={<>Privacy policy</>}
      lede="Plain-language summary for a hackathon-stage project. This page describes current practice, not legal guarantees — review it as project documentation."
    >
      <section aria-label="Data we store" className="rounded-2xl border bg-card/50 p-5 sm:p-6 space-y-3 text-sm">
        <h2 className="text-xl font-bold">Data we store</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
          <li>Account basics: your email address and chosen display name, needed for sign-in.</li>
          <li>Quest content you create: titles, descriptions, categories, difficulties, and statuses.</li>
          <li>Progression derived from quests: XP, gold, level, attributes, and streaks.</li>
        </ul>
      </section>
      <section aria-label="How data is used" className="rounded-2xl border bg-card/50 p-5 sm:p-6 space-y-3 text-sm">
        <h2 className="text-xl font-bold">How data is used</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
          <li>To operate your account: sign-in sessions, your quests, and your progression.</li>
          <li>To enforce isolation: database rules ensure you can only read and change your own data.</li>
          <li>We do not sell personal data. Analytics, if added later, will be disclosed here first.</li>
        </ul>
      </section>
      <section aria-label="Storage and retention" className="rounded-2xl border bg-card/50 p-5 sm:p-6 space-y-3 text-sm">
        <h2 className="text-xl font-bold">Storage and retention</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
          <li>Data is stored with our hosting/database providers as required to run the app.</li>
          <li>Deleting your account removes your profile and quests through cascading deletes.</li>
          <li>As a project-stage app, backup and retention practices may change; material changes will be noted here.</li>
        </ul>
      </section>
      <section aria-label="Contact" className="rounded-2xl border bg-card/50 p-5 sm:p-6 text-sm">
        <h2 className="text-xl font-bold">Questions</h2>
        <p className="mt-2 text-muted-foreground">
          For privacy questions about this project-stage deployment, contact the project maintainers
          through the repository or deployment channel where you found LIFEFORGE.
        </p>
      </section>
    </InfoPage>
  );
}
