import { Metadata } from "next";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Begin Your Journey",
  description: "Create your LIFEFORGE character and start forging your legend.",
};

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center px-4 py-12 sm:py-20">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border/60 bg-card/40 p-8 shadow-2xl backdrop-blur-sm sm:p-10">
          <div className="mb-8 text-center">
            <p className="kicker">Begin</p>
            <h1 className="mb-2 mt-2 text-3xl font-bold tracking-tight">Forge Your Character</h1>
            <p className="text-muted-foreground">Every legend begins with a single step</p>
          </div>
          <SignupForm />
        </div>
      </div>
    </div>
  );
}