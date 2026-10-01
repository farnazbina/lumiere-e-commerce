"use client";

import Image from "next/image";
import Link from "next/link";
import { useAccount } from "./use-account";
import { AccountShell } from "./AccountShell";

export default function OrdersPage({ orderId }: { orderId?: string }) {
  const { data } = useAccount();
  const order = data.orders.find((item) => item.id === orderId);
  return (
    <AccountShell title={orderId ? "Order details" : "My orders"}>
      <p className="mb-6 text-sm text-muted-foreground">
        Demo orders are saved in this browser. No payment is taken and no items
        are shipped.
      </p>
      {orderId ? (
        order ? (
          <>
            <Link href="/orders" className="text-sm text-brand underline">
              ← Back to orders
            </Link>
            <section className="mt-5 rounded-xl border bg-card p-6">
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <h2 className="font-serif text-2xl">
                    Order #{order.id.slice(0, 8).toUpperCase()}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="h-fit rounded-full bg-brand-soft px-3 py-1 text-sm text-brand">
                  {order.status}
                </span>
              </div>
              <div className="mt-6 divide-y">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 py-5">
                    <Link
                      href={`/products/${item.id}`}
                      className="relative size-20 shrink-0 rounded-lg bg-muted"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-contain p-2"
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/products/${item.id}`}
                        className="text-sm font-medium"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Quantity: {item.quantity} · ${item.price.toFixed(2)}{" "}
                        each
                      </p>
                    </div>
                    <p className="text-sm font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <dl className="ml-auto mt-5 max-w-sm space-y-3 border-t pt-5 text-sm">
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd>${order.subtotal.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Taxes</dt>
                  <dd>${order.taxes.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Delivery</dt>
                  <dd>Free</dd>
                </div>
                <div className="flex justify-between font-semibold">
                  <dt>Total</dt>
                  <dd>${order.total.toFixed(2)}</dd>
                </div>
              </dl>
            </section>
            <section className="mt-5 rounded-xl border bg-card p-6">
              <h2 className="font-serif text-xl">Delivery address</h2>
              <p className="mt-3 text-sm leading-7">
                {order.address.name}
                <br />
                {order.address.street}
                <br />
                {order.address.city}, {order.address.postalCode}
                <br />
                {order.address.country}
                <br />
                {order.address.phone}
              </p>
            </section>
          </>
        ) : (
          <Empty
            title="Order not found"
            text="This order is not saved for your account in this browser."
            href="/orders"
            label="Back to orders"
          />
        )
      ) : data.orders.length ? (
        <div className="space-y-4">
          {data.orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="flex flex-wrap items-center justify-between gap-5 rounded-xl border bg-card p-6 transition hover:border-brand"
            >
              <div>
                <h2 className="font-medium">
                  Order #{order.id.slice(0, 8).toUpperCase()}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString()} ·{" "}
                  {order.items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                  items
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-brand">{order.status}</span>
                <p className="mt-2 font-semibold">${order.total.toFixed(2)}</p>
                <span className="mt-2 block text-sm underline">
                  View details →
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <Empty
          title="No orders yet"
          text="Your orders will appear here after completing the demo checkout."
          href="/products"
          label="Start shopping"
        />
      )}
    </AccountShell>
  );
}

function Empty({
  title,
  text,
  href,
  label,
}: {
  title: string;
  text: string;
  href: string;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-dashed p-12 text-center">
      <h2 className="font-serif text-2xl">{title}</h2>
      <p className="mt-3 text-sm text-muted-foreground">{text}</p>
      <Link href={href} className="mt-6 inline-block text-brand underline">
        {label}
      </Link>
    </div>
  );
}
