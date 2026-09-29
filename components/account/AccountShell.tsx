"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAccount } from "./use-account";

const links = [["/profile", "My profile"], ["/orders", "My orders"], ["/addresses", "Addresses"], ["/wishlist", "Wishlist"]];
export function AccountShell({ title, children }: { title: string; children: React.ReactNode }) {
  const { user, ready, error, setUser } = useAccount();
  const pathname = usePathname();
  const router = useRouter();
  const [logoutError, setLogoutError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (ready && !user && !error) router.replace("/auth/login"); }, [ready, user, error, router]);
  if (!ready || !user) return <main className="mx-auto min-h-96 max-w-6xl px-5 py-20" role="status">{error || "Opening your account…"}{error && <Link className="mt-4 block underline" href="/auth/login">Go to login</Link>}</main>;
  return <main className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-10">
    <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Your personal collection</p>
    <h1 className="mt-3 font-serif text-4xl sm:text-5xl">{title}</h1>
    <p className="mt-4 text-sm text-muted-foreground">Addresses, wishlist items, and demo orders are saved only in this browser. <Link href="/about-demo" className="text-brand underline">About this demo</Link></p>
    <div className="mt-10 grid gap-8 lg:grid-cols-[230px_1fr]">
      <aside className="h-fit rounded-xl border bg-card p-4">
        <p className="break-words px-3 py-3 font-medium">{user.user_metadata.full_name || user.email}</p>
        <nav aria-label="Account navigation" className="flex flex-wrap gap-1 lg:flex-col">{links.map(([href, label]) => <Link key={href} href={href} aria-current={pathname === href || pathname.startsWith(`${href}/`) ? "page" : undefined} className={`rounded-lg px-3 py-3 text-sm transition ${pathname === href || pathname.startsWith(`${href}/`) ? "bg-brand-soft font-semibold text-brand" : "hover:bg-muted"}`}>{label}</Link>)}</nav>
        <button disabled={busy} className="mt-4 w-full border-t px-3 pt-4 text-left text-sm text-muted-foreground disabled:opacity-50" onClick={async () => { setBusy(true); setLogoutError(""); try { const { error } = await createClient().auth.signOut(); if (error) throw error; setUser(null); router.replace("/auth/login"); } catch { setLogoutError("Could not sign out. Please try again."); } finally { setBusy(false); } }}>{busy ? "Signing out…" : "Sign out"}</button>
      </aside>
      <div className="min-w-0">{(error || logoutError) && <p role="alert" className="mb-5 text-sm text-destructive">{error || logoutError}</p>}{children}</div>
    </div>
  </main>;
}
