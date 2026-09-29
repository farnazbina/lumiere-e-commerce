import ShopCatalog from "@/components/shop/ShopCatalog";
import { Suspense } from "react";

function CatalogFallback() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[1440px] animate-pulse px-4 py-16 sm:px-6 lg:px-10">
      <div className="h-14 w-72 bg-muted" />
      <div className="mt-12 grid gap-8 lg:grid-cols-[250px_1fr]">
        <div className="hidden h-96 bg-muted lg:block" />
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="aspect-[4/5] bg-muted" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<CatalogFallback />}>
      <ShopCatalog />
    </Suspense>
  );
}
