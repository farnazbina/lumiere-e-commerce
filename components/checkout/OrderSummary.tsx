import Link from "next/link";

export default function OrderSummary({
  subtotal,
  taxes,
  deliveryFee = 0,
  actionLabel,
  actionHref,
  onAction,
}: {
  subtotal: number;
  taxes: number;
  deliveryFee?: number;
  actionLabel: string;
  actionHref?: string;
  onAction?: () => void;
}) {
  const total = subtotal + taxes + deliveryFee;

  return (
    <aside className="border border-border bg-card p-6 lg:sticky lg:top-8" aria-labelledby="checkout-summary-title">
      <h2 id="checkout-summary-title" className="font-serif text-2xl text-foreground">Order summary</h2>
      <div className="mt-6 space-y-4 border-y border-border py-5 text-sm">
        <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span className="text-foreground">${subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between text-muted-foreground"><span>Taxes</span><span className="text-foreground">${taxes.toFixed(2)}</span></div>
        <div className="flex justify-between text-muted-foreground"><span>Delivery fee</span><span className={deliveryFee === 0 ? "font-semibold text-success" : "text-foreground"}>{deliveryFee === 0 ? "FREE" : `$${deliveryFee.toFixed(2)}`}</span></div>
      </div>
      <div className="flex items-center justify-between py-6 text-base font-semibold text-foreground"><span>Grand total</span><span>${total.toFixed(2)}</span></div>
      {onAction ? (
        <button type="button" onClick={onAction} className="flex min-h-12 w-full items-center justify-center bg-brand-solid px-5 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-brand-hover">{actionLabel}</button>
      ) : (
        <Link href={actionHref ?? "#"} className="flex min-h-12 items-center justify-center bg-brand-solid px-5 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-brand-hover">{actionLabel}</Link>
      )}
    </aside>
  );
}
