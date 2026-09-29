"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiX } from "react-icons/fi";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true); setError(null);
    try {
      const { error } = await createClient().auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push("/profile");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally { setIsLoading(false); }
  };

  return <><AuthHeading title="Welcome" subtitle="Please login here" /><form onSubmit={handleLogin} className="mt-7 space-y-5"><AuthInput label="Email address" id="email" type="email" value={email} onChange={setEmail} placeholder="alexa.williams@example.com" /><AuthInput label="Password" id="password" type="password" value={password} onChange={setPassword} /><div className="flex items-center justify-between gap-4"><Link href="/auth/forgot-password" className="text-sm text-brand hover:underline">Forgot password?</Link></div>{error && <p className="text-sm text-destructive">{error}</p>}<button disabled={isLoading} className="min-h-12 w-full bg-brand-solid text-xs font-semibold uppercase tracking-[0.12em] text-white hover:bg-brand-hover disabled:opacity-60">{isLoading ? "Logging in…" : "Login"}</button><Link href="/auth/sign-up" className="flex min-h-12 items-center justify-center border border-brand text-xs font-semibold uppercase tracking-[0.12em] text-brand hover:bg-brand-soft">Register</Link></form></>;
}

export function AuthHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return <div className="relative pr-10"><h1 className="font-serif text-3xl tracking-[-0.03em] text-foreground">{title}</h1><p className="mt-1.5 text-xs text-muted-foreground">{subtitle}</p><Link href="/" aria-label="Close" className="absolute -right-1 -top-1 grid size-9 place-items-center text-muted-foreground hover:text-foreground"><FiX /></Link></div>;
}

export function AuthInput({ label, id, type = "text", value, onChange, placeholder }: { label: string; id: string; type?: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <label className="block" htmlFor={id}><span className="mb-2 block text-xs text-muted-foreground">{label}</span><input id={id} type={type} required value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="min-h-11 w-full border border-border px-4 text-sm text-foreground outline-none transition focus:border-brand" /></label>;
}
