"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-2">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          className={cn(
            "w-full px-4 py-3 rounded-lg border bg-background/50",
            "text-foreground placeholder:text-muted-foreground",
            "border-input focus:border-primary focus:ring-2 focus:ring-primary/20",
            "focus:outline-none transition-all duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "text-lg"
          )}
          aria-describedby={error ? "login-error" : undefined}
          aria-invalid={!!error}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-muted-foreground mb-2">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          className={cn(
            "w-full px-4 py-3 rounded-lg border bg-background/50",
            "text-foreground placeholder:text-muted-foreground",
            "border-input focus:border-primary focus:ring-2 focus:ring-primary/20",
            "focus:outline-none transition-all duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "text-lg"
          )}
          aria-describedby={error ? "login-error" : undefined}
          aria-invalid={!!error}
        />
      </div>

      {error && (
        <div
          id="login-error"
          role="alert"
          className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm animate-in"
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={cn(
          "w-full py-3 px-4 rounded-lg font-semibold text-lg",
          "bg-primary text-primary-foreground",
          "hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
          "transition-all duration-200",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "animate-in"
        )}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Entering the forge...
          </span>
        ) : (
          "Enter the Forge"
        )}
      </button>

      <p className="text-center text-sm text-muted-foreground">
        New to LIFEFORGE?{" "}
        <Link href="/signup" className="text-primary hover:underline font-medium">
          Begin your journey
        </Link>
      </p>
    </form>
  );
}