import { PRODUCTS } from "./catalog";

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
}

export function searchProducts(query: string) {
  const term = normalize(query);
  return PRODUCTS.filter((product) => normalize(product.name).includes(term));
}
