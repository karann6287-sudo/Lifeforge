import { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Enter the Forge",
  description: "Sign in to LIFEFORGE and continue your adventure.",
};

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center px-4 py-12 sm:py-20">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border/60 bg-card/40 p-8 shadow-2xl backdrop-blur-sm sm:p-10">
          <div className="mb-8 text-center">
            <p className="kicker">Return</p>
            <h1 className="mb-2 mt-2 text-3xl font-bold tracking-tight">Welcome Back, Adventurer</h1>
            <p className="text-muted-foreground">Enter the forge to continue your journey</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}