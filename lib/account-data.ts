import type { CartItem } from "@/stores/cart-store";

export type Address = { id: string; name: string; phone: string; street: string; city: string; postalCode: string; country: string };
export type Order = { id: string; createdAt: string; items: CartItem[]; address: Address; subtotal: number; taxes: number; total: number; status: "Demo order" };
export type AccountData = { addresses: Address[]; wishlist: number[]; orders: Order[]; selectedAddress: string | null };
export const emptyAccount = (): AccountData => ({ addresses: [], wishlist: [], orders: [], selectedAddress: null });
export const accountStorageKey = (userId: string) => `lumiere-account:${userId}`;

const record = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;
const money = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value) && value >= 0;
const addressValid = (value: unknown): value is Address => record(value) && ["id", "name", "phone", "street", "city", "postalCode", "country"].every(key => typeof value[key] === "string" && String(value[key]).trim().length > 0);
const itemValid = (value: unknown): boolean => record(value) && Number.isSafeInteger(value.id) && typeof value.name === "string" && typeof value.image === "string" && value.image.startsWith("/images/") && money(value.price) && Number.isSafeInteger(value.quantity) && Number(value.quantity) > 0;
const orderValid = (value: unknown): boolean => record(value) && typeof value.id === "string" && typeof value.createdAt === "string" && Number.isFinite(Date.parse(value.createdAt)) && value.status === "Demo order" && addressValid(value.address) && Array.isArray(value.items) && value.items.length > 0 && value.items.every(itemValid) && [value.subtotal, value.taxes, value.total].every(money);

export function readAccount(storage: Pick<Storage, "getItem">, userId: string): AccountData {
  const raw = storage.getItem(accountStorageKey(userId));
  if (!raw) return emptyAccount();
  const value: unknown = JSON.parse(raw);
  if (!record(value) || !Array.isArray(value.addresses) || !value.addresses.every(addressValid) || !Array.isArray(value.orders) || !value.orders.every(orderValid) || !Array.isArray(value.wishlist) || !value.wishlist.every(id => Number.isSafeInteger(id) && id > 0) || !(value.selectedAddress === null || typeof value.selectedAddress === "string")) throw new Error("Invalid saved account data");
  return { addresses: value.addresses, orders: value.orders as Order[], wishlist: [...new Set(value.wishlist as number[])], selectedAddress: value.addresses.some(address => address.id === value.selectedAddress) ? value.selectedAddress as string : value.addresses[0]?.id ?? null };
}

export function createDemoOrder(items: CartItem[], address: Address, id: string, createdAt: string): Order {
  if (!items.length || !items.every(itemValid) || !addressValid(address)) throw new Error("Choose valid items and a delivery address before placing an order.");
  const cents = items.reduce((sum, item) => sum + Math.round(item.price * 100) * item.quantity, 0);
  const taxCents = Math.round(cents * 0.07);
  if (!Number.isSafeInteger(cents + taxCents)) throw new Error("The order total is too large.");
  return { id, createdAt, status: "Demo order", items: items.map(item => ({ ...item })), address: { ...address }, subtotal: cents / 100, taxes: taxCents / 100, total: (cents + taxCents) / 100 };
}
