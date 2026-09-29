import ProductDetails from "@/components/shop/ProductDetails";
import { notFound } from "next/navigation";
import { PRODUCTS } from "@/lib/data/catalog";

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ id: String(product.id) }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!PRODUCTS.some(product => String(product.id) === id)) notFound();
  return <ProductDetails key={id} productId={id} />;
}
