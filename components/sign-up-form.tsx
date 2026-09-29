"use client";

import { AuthHeading, AuthInput } from "./login-form";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignUpForm() {
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [error, setError] = useState<string | null>(null); const [isLoading, setIsLoading] = useState(false); const router = useRouter();
  const submit = async (event: React.FormEvent) => { event.preventDefault(); setIsLoading(true); setError(null); try { const { data, error } = await createClient().auth.signUp({ email, password, options: { data: { name: name.trim().split(/\s+/)[0], full_name: name.trim(), phone: "" }, emailRedirectTo: `${window.location.origin}/profile` } }); if (error) throw error; router.push(data.session ? "/profile" : "/auth/sign-up-success"); } catch (error: unknown) { setError(error instanceof Error ? error.message : "An error occurred"); } finally { setIsLoading(false); } };
  return <><AuthHeading title="Create new account" subtitle="Please enter your details" /><form onSubmit={submit} className="mt-7 space-y-4"><AuthInput label="Name" id="name" value={name} onChange={setName} placeholder="Alexa Williams" /><AuthInput label="Email address" id="signup-email" type="email" value={email} onChange={setEmail} placeholder="alexa.williams@example.com" /><AuthInput label="Password" id="signup-password" type="password" value={password} onChange={setPassword} /><label className="flex items-center gap-2 text-xs text-muted-foreground"><input type="checkbox" required className="size-4 accent-brand" />I understand this is a portfolio demo</label>{error && <p className="text-sm text-destructive">{error}</p>}<button disabled={isLoading} className="min-h-12 w-full bg-brand-solid text-xs font-semibold uppercase tracking-[0.12em] text-white hover:bg-brand-hover disabled:opacity-60">{isLoading ? "Creating account…" : "Register"}</button><Link href="/auth/login" className="flex min-h-12 items-center justify-center border border-brand text-xs font-semibold uppercase tracking-[0.12em] text-brand">Login</Link></form></>;
}
