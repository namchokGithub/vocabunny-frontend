"use client";

import { FormField } from "@/components/form/form-field";
import { PrimaryButton } from "@/components/ui/button";
import { login } from "@/lib/auth/auth";
import { useSession } from "@/lib/hooks/use-session";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { session, isLoading } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && session) {
      router.replace("/dashboard");
    }
  }, [isLoading, session, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login({ email, password });
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="card w-full max-w-md rounded-4xl p-8">
        <p className="text-sm font-semibold tracking-[0.18em] text-(--primary) uppercase">
          VocabBunny BO
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-950">Staff Login</h1>
        <p className="mt-2 text-sm text-slate-500">
          Access the internal admin console for content, economy, and operations.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <FormField
            label="Email"
            placeholder="staff@vocabunny.co"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <FormField
            label="Password"
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <PrimaryButton className="w-full" type="submit" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign In"}
          </PrimaryButton>
        </form>
      </div>
    </main>
  );
}
