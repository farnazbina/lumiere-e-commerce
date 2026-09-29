import { PRODUCTS, PRODUCT_CATEGORIES } from "@/lib/data/catalog";

type ShopFiltersProps = {
  selected: string[];
  onToggle: (category: string) => void;
  maxPrice: number;
  onPriceChange: (price: number) => void;
};

export default function ShopFilters({ selected, onToggle, maxPrice, onPriceChange }: ShopFiltersProps) {
  return (
    <div className="space-y-8">
      <FilterGroup title="Categories">
        {PRODUCT_CATEGORIES.map((category) => (
          <label key={category} className="flex cursor-pointer items-center gap-3 text-sm text-muted-foreground">
            <input type="checkbox" checked={selected.includes(category)} onChange={() => onToggle(category)} className="size-4 accent-brand" />
            <span>{category}</span>
            <span className="ml-auto text-xs text-muted-foreground">({PRODUCTS.filter((product) => product.category === category).length})</span>
          </label>
        ))}
      </FilterGroup>
      <FilterGroup title="Price range">
        <div className="mb-4 flex justify-between text-xs text-muted-foreground"><span>$0</span><span>${maxPrice}</span></div>
        <input type="range" min="100" max="500" step="10" value={maxPrice} onChange={(event) => onPriceChange(Number(event.target.value))} className="w-full accent-brand" aria-label="Maximum price" />
      </FilterGroup>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="border-t border-border pt-7 first:border-0 first:pt-0"><h2 className="mb-5 text-sm font-semibold text-foreground">{title}</h2><div className="space-y-3">{children}</div></section>;
}
