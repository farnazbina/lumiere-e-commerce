export type ProductCategory =
  | "Rings"
  | "Earrings"
  | "Bracelets"
  | "Pendants"
  | "Necklaces";

export type Product = {
  id: number;
  name: string;
  category: ProductCategory;
  price: number;
  image: string;
  color: "Gold";
  material: string;
  description: string;
};

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  "Rings",
  "Earrings",
  "Bracelets",
  "Pendants",
  "Necklaces",
];

export const PRODUCTS: Product[] = [
  { id: 1, name: "Lumière Twist Ring", category: "Rings", price: 189, image: "/images/products/twist-ring.png", color: "Gold", material: "18k gold", description: "A delicate twisted gold ring finished with a brilliant round stone." },
  { id: 2, name: "Stellar Gold Hoops", category: "Earrings", price: 245, image: "/images/products/stellar-hoops.png", color: "Gold", material: "18k gold", description: "Polished gold hoops with subtle star-set diamond details." },
  { id: 3, name: "Élan Tennis Bracelet", category: "Bracelets", price: 420, image: "/images/products/tennis-bracelet.png", color: "Gold", material: "18k gold · Diamond", description: "A timeless line bracelet set with luminous white stones." },
  { id: 4, name: "Petite Pearl Necklace", category: "Necklaces", price: 215, image: "/images/products/pearl-necklace.png", color: "Gold", material: "18k gold · Pearl", description: "A fine gold chain finished with an organic petite pearl." },
  { id: 5, name: "Sculpted Wave Ring Set", category: "Rings", price: 265, image: "/images/categories/rings.png", color: "Gold", material: "18k gold", description: "A coordinated trio of fluid, sculptural stacking rings." },
  { id: 6, name: "Celeste Diamond Hoops", category: "Earrings", price: 290, image: "/images/categories/earrings.png", color: "Gold", material: "18k gold · Diamond", description: "Classic hoops illuminated by a row of bezel-set stones." },
  { id: 7, name: "Solis Bangle", category: "Bracelets", price: 325, image: "/images/categories/bracelets.png", color: "Gold", material: "18k gold", description: "A slender sculptural bangle with a subtle diamond accent." },
  { id: 8, name: "Sunburst Pendant", category: "Pendants", price: 195, image: "/images/categories/pendants.png", color: "Gold", material: "18k gold · Diamond", description: "A radiant medallion suspended from a delicate gold chain." },
  { id: 9, name: "Moonlight Layers", category: "Necklaces", price: 350, image: "/images/categories/necklaces.png", color: "Gold", material: "18k gold · Moonstone", description: "An effortless trio of celestial-inspired layering chains." },
];

export function getProduct(productId: string | number) {
  return PRODUCTS.find((product) => product.id === Number(productId));
}

export const PRODUCT_GALLERY_FALLBACKS = [
  "/images/products/twist-ring.png",
  "/images/categories/rings.png",
  "/images/products/stellar-hoops.png",
  "/images/products/tennis-bracelet.png",
];
