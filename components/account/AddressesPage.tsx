"use client";

import { useEffect, useRef, useState } from "react";
import { AccountShell } from "./AccountShell";
import { useAccount } from "./use-account";
import type { Address } from "@/lib/account-data";

export default function AddressesPage() { return <AccountShell title="My addresses"><AddressBook /></AccountShell>; }

export function AddressBook({ selectable = false }: { selectable?: boolean }) {
  const { user, data, updateData } = useAccount();
  const [open, setOpen] = useState(false);
  return <section>
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4"><p className="text-sm text-muted-foreground">Save delivery addresses for your next order.</p><button onClick={() => setOpen(true)} className="rounded-lg bg-brand-solid px-5 py-3 text-sm font-semibold text-white hover:bg-brand-hover">Add new address</button></div>
    {!data.addresses.length && <div className="rounded-xl border border-dashed p-10 text-center"><h2 className="font-serif text-2xl">No addresses yet</h2><p className="mt-3 text-sm text-muted-foreground">Add your first delivery address to get started.</p></div>}
    <div className="grid gap-4 sm:grid-cols-2">{data.addresses.map(address => <article key={address.id} className={`rounded-xl border bg-card p-6 ${data.selectedAddress === address.id ? "border-brand" : ""}`}>
      <h2 className="font-semibold">{address.name}</h2><p className="mt-3 whitespace-pre-line text-sm leading-6 text-muted-foreground">{address.street}{"\n"}{address.city}, {address.postalCode}{"\n"}{address.country}{"\n"}{address.phone}</p>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm"><button aria-pressed={data.selectedAddress === address.id} className="text-brand underline underline-offset-4" onClick={() => updateData(current => ({ ...current, selectedAddress: address.id }))}>{data.selectedAddress === address.id ? (selectable ? "Selected for delivery" : "Default address") : (selectable ? "Deliver here" : "Make default")}</button><button aria-label={`Remove address at ${address.street}`} className="text-muted-foreground hover:text-destructive" onClick={() => updateData(current => { const addresses = current.addresses.filter(item => item.id !== address.id); return { ...current, addresses, selectedAddress: current.selectedAddress === address.id ? addresses[0]?.id ?? null : current.selectedAddress }; })}>Remove</button></div>
    </article>)}</div>
    {open && <AddressModal name={user?.user_metadata.full_name || ""} phone={user?.user_metadata.phone || ""} onClose={() => setOpen(false)} onSave={address => updateData(current => ({ ...current, addresses: [...current.addresses, address], selectedAddress: current.selectedAddress || address.id }))} />}
  </section>;
}

function AddressModal({ name, phone, onClose, onSave }: { name: string; phone: string; onClose: () => void; onSave: (address: Address) => boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState("");
  useEffect(() => { const element = dialog.current; element?.showModal(); const overflow = document.body.style.overflow; document.body.style.overflow = "hidden"; return () => { element?.close(); document.body.style.overflow = overflow; }; }, []);
  return <dialog ref={dialog} onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) onClose(); }} aria-labelledby="address-modal-title" className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-2xl border bg-card p-0 text-foreground shadow-2xl backdrop:bg-black/60">
    <form className="p-6 sm:p-8" onSubmit={event => { event.preventDefault(); const values = new FormData(event.currentTarget); const fields = Object.fromEntries([...values.entries()].map(([key, value]) => [key, String(value).trim()])); if (Object.values(fields).some(value => !value)) { setError("Please complete every field."); return; } if (onSave({ ...fields, id: crypto.randomUUID() } as Address)) onClose(); else setError("Could not save the address. Check browser storage and try again."); }}>
      <div className="mb-6 flex items-center justify-between"><h2 id="address-modal-title" className="font-serif text-2xl">Add new address</h2><button type="button" onClick={onClose} aria-label="Close address form" className="grid size-10 place-items-center rounded-full hover:bg-muted">✕</button></div>
      <div className="grid gap-4 sm:grid-cols-2">{[["name", "Full name", "name"], ["phone", "Phone number", "tel"], ["street", "Street address", "street-address"], ["city", "City", "address-level2"], ["postalCode", "Postal code", "postal-code"], ["country", "Country", "country-name"]].map(([key, label, autoComplete]) => <label key={key} className={`text-sm ${key === "street" ? "sm:col-span-2" : ""}`}><span className="mb-2 block text-muted-foreground">{label}</span><input name={key} required maxLength={200} autoComplete={autoComplete} type={key === "phone" ? "tel" : "text"} defaultValue={key === "name" ? name : key === "phone" ? phone : ""} className="min-h-12 w-full rounded-lg border border-input px-3" /></label>)}</div>
      {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
      <button className="mt-6 w-full rounded-lg bg-brand-solid py-3 text-sm font-semibold text-white hover:bg-brand-hover">Save address</button>
    </form>
  </dialog>;
}
