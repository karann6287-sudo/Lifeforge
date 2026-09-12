import { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Main } from "@/components/Main";

export const metadata: Metadata = {
  title: "Enter the Forge",
  description: "Sign in to LIFEFORGE and continue your adventure.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Main className="flex-1 flex items-center justify-center px-4 py-12 sm:py-20">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border bg-card/50 backdrop-blur-sm p-8 sm:p-10 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome Back, Adventurer</h1>
              <p className="text-muted-foreground">Enter the forge to continue your journey</p>
            </div>
            <LoginForm />
          </div>
        </div>
      </Main>
      <Footer />
    </div>
  );
}