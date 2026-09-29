import { Suspense } from "react";
import OrdersPage from "@/components/account/OrdersPage";

async function Details({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OrdersPage orderId={id} />;
}
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <Suspense fallback={<p className="p-12" role="status">Loading order?</p>}><Details params={params} /></Suspense>;
}
