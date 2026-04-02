import { PrimaryButton } from "@/components/ui/button";
import { FormField } from "@/components/form/form-field";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="card w-full max-w-md rounded-[32px] p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
          VocabBunny BO
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-950">Staff Login</h1>
        <p className="mt-2 text-sm text-slate-500">
          Access the internal admin console for content, economy, and operations.
        </p>

        <form className="mt-8 space-y-5">
          <FormField label="Email" placeholder="staff@vocabunny.co" type="email" />
          <FormField label="Password" placeholder="••••••••" type="password" />
          <PrimaryButton className="w-full">Sign In</PrimaryButton>
        </form>
      </div>
    </main>
  );
}
