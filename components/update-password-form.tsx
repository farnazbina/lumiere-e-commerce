"use client";

import { AuthHeading, AuthInput } from "./login-form";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useState } from "react";

export function UpdatePasswordForm() {
  const [password, setPassword] = useState(""); const [repeatPassword, setRepeatPassword] = useState(""); const [error, setError] = useState<string | null>(null); const [success, setSuccess] = useState(false); const [isLoading, setIsLoading] = useState(false);
  const submit = async (event: React.FormEvent) => { event.preventDefault(); setError(null); if (password !== repeatPassword) { setError("Passwords do not match"); return; } setIsLoading(true); try { const { error } = await createClient().auth.updateUser({ password }); if (error) throw error; setSuccess(true); } catch (error: unknown) { setError(error instanceof Error ? error.message : "An error occurred"); } finally { setIsLoading(false); } };
  if (success) return <div className="text-center"><div className="mx-auto grid size-16 place-items-center rounded-full bg-brand-soft text-2xl text-brand ring-8 ring-brand-soft">✓</div><h1 className="mt-7 font-serif text-3xl leading-tight text-foreground">Password updated successfully</h1><p className="mt-3 text-sm text-muted-foreground">Your password has been updated successfully.</p><Link href="/auth/login" className="mt-7 flex min-h-12 items-center justify-center bg-brand-solid text-xs font-semibold uppercase tracking-[0.12em] text-white">Back to login</Link></div>;
  return <><AuthHeading title="Enter new password" subtitle="Please enter your new password" /><form onSubmit={submit} className="mt-7 space-y-5"><AuthInput label="New password" id="new-password" type="password" value={password} onChange={setPassword} /><AuthInput label="Re-enter new password" id="repeat-new-password" type="password" value={repeatPassword} onChange={setRepeatPassword} />{error && <p className="text-sm text-destructive">{error}</p>}<button disabled={isLoading} className="min-h-12 w-full bg-brand-solid text-xs font-semibold uppercase tracking-[0.12em] text-white disabled:opacity-60">{isLoading ? "Saving…" : "Submit"}</button></form></>;
}
