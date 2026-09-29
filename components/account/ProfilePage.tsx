"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAccount } from "./use-account";
import { AccountShell } from "./AccountShell";

export default function ProfilePage() {
  const { user, data, setUser } = useAccount();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  return <AccountShell title="My profile">
    <div className="mb-8 grid grid-cols-3 gap-3">{[["Orders", data.orders.length, "/orders"], ["Addresses", data.addresses.length, "/addresses"], ["Wishlist", data.wishlist.length, "/wishlist"]].map(([label, count, href]) => <Link key={label} href={String(href)} className="rounded-xl border bg-card p-4 transition hover:border-brand sm:p-6"><span className="block font-serif text-3xl">{count}</span><span className="mt-2 block text-sm text-muted-foreground">{label}</span></Link>)}</div>
    {user && <form key={user.id} className="rounded-xl border bg-card p-6 sm:p-8" onSubmit={async event => {
      event.preventDefault(); setBusy(true); setError(""); setMessage("");
      const values = new FormData(event.currentTarget);
      try { const { data, error } = await createClient().auth.updateUser({ data: { name: String(values.get("name")).trim(), full_name: String(values.get("full_name")).trim(), phone: String(values.get("phone")).trim() } }); if (error) throw error; setUser(data.user); setMessage("Your profile has been saved."); }
      catch (error) { setError(error instanceof Error ? error.message : "Could not save your profile."); } finally { setBusy(false); }
    }}>
      <h2 className="font-serif text-2xl">Personal information</h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <ProfileField label="Name" name="name" value={user.user_metadata.name || user.user_metadata.full_name?.split(" ")[0] || ""} required />
        <ProfileField label="Full name" name="full_name" value={user.user_metadata.full_name || ""} required />
        <ProfileField label="Email address" name="email" type="email" value={user.email || ""} readOnly />
        <ProfileField label="Phone number" name="phone" type="tel" value={user.user_metadata.phone || user.phone || ""} />
      </div>
      <p className="mt-4 text-xs text-muted-foreground">Your email is managed by your sign-in account.</p>
      {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
      <p role="status" className="mt-4 text-sm text-success">{message}</p>
      <button disabled={busy} className="mt-5 rounded-lg bg-brand-solid px-6 py-3 text-sm font-semibold text-white hover:bg-brand-hover disabled:opacity-50">{busy ? "Saving…" : "Save changes"}</button>
    </form>}
  </AccountShell>;
}

function ProfileField({ label, name, value, type = "text", required, readOnly }: { label: string; name: string; value: string; type?: string; required?: boolean; readOnly?: boolean }) {
  return <label className="text-sm"><span className="mb-2 block text-muted-foreground">{label}</span><input name={name} type={type} defaultValue={value} required={required} readOnly={readOnly} maxLength={160} autoComplete={name === "full_name" ? "name" : name === "phone" ? "tel" : name === "email" ? "email" : "nickname"} className="min-h-12 w-full rounded-lg border border-input px-4 read-only:bg-muted" /></label>;
}
