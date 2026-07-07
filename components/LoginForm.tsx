"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import PillLabel from "@/components/PillLabel";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

type Mode = "signin" | "signup";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const authError = searchParams.get("error") === "auth";
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(
    authError ? "Sign-in link expired or invalid. Try again." : null,
  );
  const [loading, setLoading] = useState(false);

  if (!isSupabaseConfigured()) {
    return (
      <div className="soft-card mx-auto max-w-md p-8 text-center">
        <h1 className="mb-3 text-xl font-semibold text-warm-dark">
          Supabase not configured
        </h1>
        <p className="mb-4 text-sm leading-6 text-warm-muted">
          Create a Supabase project, then add your URL and anon key to{" "}
          <code className="rounded bg-warm-pill/50 px-1.5 py-0.5 text-xs">
            .env.local
          </code>
          . See <code className="rounded bg-warm-pill/50 px-1.5 py-0.5 text-xs">env.example</code>{" "}
          in the repo for the variable names.
        </p>
        <Link
          href="/"
          className="text-sm font-medium text-accent hover:text-accent-hover"
        >
          ← Back home
        </Link>
      </div>
    );
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();

    if (mode === "signup") {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      setMessage("Check your email to confirm your account, then sign in.");
      setMode("signin");
      setLoading(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push("/results");
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-8 text-center">
        <div className="mb-4 flex justify-center">
          <PillLabel>Account</PillLabel>
        </div>
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-warm-dark">
          {mode === "signin" ? "Log in" : "Create account"}
        </h1>
        <p className="text-sm text-warm-muted">
          Phase 1 — auth only. Game scores still save locally until Phase 2.
        </p>
      </div>

      <div className="soft-card p-8">
        <div className="mb-6 grid grid-cols-2 gap-2 rounded-full bg-warm-pill/40 p-1">
          <button
            type="button"
            onClick={() => setMode("signin")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              mode === "signin"
                ? "bg-cream-card text-warm-dark shadow-sm"
                : "text-warm-muted"
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              mode === "signup"
                ? "bg-cream-card text-warm-dark shadow-sm"
                : "text-warm-muted"
            }`}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-warm-muted"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-warm-pill bg-white px-4 py-3 text-sm text-warm-dark outline-none ring-accent/30 focus:ring-2"
              autoComplete="email"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-warm-muted"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-warm-pill bg-white px-4 py-3 text-sm text-warm-dark outline-none ring-accent/30 focus:ring-2"
              autoComplete={
                mode === "signup" ? "new-password" : "current-password"
              }
            />
          </div>

          {error && (
            <p className="text-sm text-red-700" role="alert">
              {error}
            </p>
          )}
          {message && (
            <p className="text-sm text-accent" role="status">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
          >
            {loading
              ? "Please wait…"
              : mode === "signin"
                ? "Log in"
                : "Create account"}
          </button>
        </form>
      </div>

      <Link
        href="/"
        className="mt-8 inline-block text-sm font-medium text-warm-muted hover:text-warm-dark"
      >
        ← Back home
      </Link>
    </div>
  );
}
